import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import { Course } from "../course/course.model";
import Faculty from "../faculty/faculty.model";
import OfferedCourse from "../offered-course/offeredCourse.model";
import SemesterRegistration from "../semester-registration/semesterRegistration.model";
import Student from "../student/student.model";
import { TEnrolledCourse } from "./enrolledCourse.interface";
import EnrolledCourse from "./enrolledCourse.model";
import calculateGradAndPoints from "./enrolledCourse.utils";

const createEnrolledCourse = async (
  userData: JwtPayload,
  payload: TEnrolledCourse,
) => {
  /**
   * step-1: check the offered course is exist
   * step-2: check the offered capacity
   * step-3: check the course by course id from offered course
   * step-4: find the student by student id
   * step-5: check the offered student already enrolled
   * step-6: check the semester registration max credits exceeded
   * step-7: create an enrolled course
   * step-8: decrement the offered capacity
   */

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const offeredCourse = await OfferedCourse.findById(
      payload.offeredCourse,
    ).session(session);
    if (!offeredCourse) {
      throw new AppError(httpStatus.NOT_FOUND, "Offered Course not found");
    }
    if (offeredCourse.maxCapacity <= 0) {
      throw new AppError(httpStatus.BAD_REQUEST, "Course capacity reached");
    }

    const course = await Course.findById(offeredCourse.course).session(session);
    if (!course) {
      throw new AppError(httpStatus.NOT_FOUND, "Course not found");
    }

    const student = await Student.findOne(
      { id: userData.userId },
      { _id: 1 },
    ).session(session);
    if (!student) {
      throw new AppError(httpStatus.NOT_FOUND, "Student not found");
    }

    const semesterRegistration = await SemesterRegistration.findById(
      offeredCourse.semesterRegistration,
    )
      .select("maxCredit")
      .session(session);
    if (!semesterRegistration) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Semester Registration not found",
      );
    }

    const isAlreadyEnrolled = await EnrolledCourse.findOne({
      semesterRegistration: offeredCourse.semesterRegistration,
      offeredCourse: offeredCourse._id,
      student: student._id,
    }).session(session);

    if (isAlreadyEnrolled) {
      throw new AppError(
        httpStatus.CONFLICT,
        "Student is already enrolled in this course",
      );
    }

    // calculate the total enrolled course credits
    const enrolledCourses = await EnrolledCourse.aggregate(
      [
        {
          $match: {
            semesterRegistration: offeredCourse.semesterRegistration,
            student: student._id,
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "course",
            foreignField: "_id",
            as: "enrolledCourseData",
          },
        },
        {
          $unwind: "$enrolledCourseData",
        },
        {
          $group: {
            _id: null,
            totalEnrolledCredits: { $sum: "$enrolledCourseData.credits" },
          },
        },
      ],
      { session },
    );

    const totalEnrolledCredits = enrolledCourses[0]?.totalEnrolledCredits ?? 0;

    if (
      totalEnrolledCredits &&
      totalEnrolledCredits + course.credits > semesterRegistration?.maxCredit
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Student's total course credits exceed the semester's maximum credit",
      );
    }

    const enrolledCourse = await EnrolledCourse.create(
      [
        {
          semesterRegistration: offeredCourse.semesterRegistration,
          academicSemester: offeredCourse.academicSemester,
          academicFaculty: offeredCourse.academicFaculty,
          academicDepartment: offeredCourse.academicDepartment,
          offeredCourse: offeredCourse._id,
          course: offeredCourse.course,
          student: student._id,
          faculty: offeredCourse.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );
    if (enrolledCourse.length < 0) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create enrolled course",
      );
    }

    offeredCourse.maxCapacity -= 1;
    await offeredCourse.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return enrolledCourse[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// update enrolled course marks
const updateEnrolledCourseMarks = async (
  userData: JwtPayload,
  payload: TEnrolledCourse,
) => {
  const { courseMarks } = payload;
  const semesterRegistration = await SemesterRegistration.findById(
    payload.semesterRegistration,
  );
  if (!semesterRegistration) {
    throw new AppError(httpStatus.NOT_FOUND, "Semester Registration not found");
  }

  const offeredCourse = await OfferedCourse.findById(payload.offeredCourse);
  if (!offeredCourse) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered Course not found");
  }

  const student = await Student.findById(payload.student);
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, "Student not found");
  }

  const faculty = await Faculty.findOne({ id: userData.userId });
  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty not found");
  }

  const isCourseBelongToFaculty = await EnrolledCourse.findOne({
    semesterRegistration: semesterRegistration._id,
    offeredCourse: offeredCourse._id,
    student: student._id,
    faculty: faculty._id,
  });
  if (!isCourseBelongToFaculty) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this course",
    );
  }

  const modifiedData: Record<string, unknown> = {
    ...courseMarks,
  };

  if (courseMarks.finalTerm) {
    const { classTest1, classTest2, midTerm } =
      isCourseBelongToFaculty.courseMarks;

    const totalMarks =
      classTest1 + classTest2 + midTerm + courseMarks.finalTerm;

    const { grade, gradePoints } = calculateGradAndPoints(totalMarks);

    modifiedData.grade = grade;
    modifiedData.gradePoints = gradePoints;
    modifiedData.isCompleted = true;
  }

  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }

  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongToFaculty._id,
    modifiedData,
    { new: true },
  );

  return result;
};

export default {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
};
