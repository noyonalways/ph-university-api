import httpStatus from "http-status";
import { isValidObjectId } from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import academicDepartmentService from "../academic-department/academicDepartment.service";
import academicFacultyService from "../academic-faculty/academicFaculty.service";
import courseService from "../course/course.service";
import facultyService from "../faculty/faculty.service";
import { RegistrationStatus } from "../semester-registration/semesterRegistration.constant";
import semesterRegistrationService from "../semester-registration/semesterRegistration.service";
import { TOfferedCourse } from "./offeredCourse.interface";
import OfferedCourse from "./offeredCourse.model";
import { hasTimeConflict } from "./offeredCourse.utils";

// create
const create = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload;

  /**
   * Step 1: check if the semester registration id is exists!
   * Step 2: check if the academic faculty id is exists!
   * Step 3: check if the academic department id is exists!
   * Step 4: check if the course id is exists!
   * Step 5: check if the faculty id is exists!
   * Step 6: check if the department is belong to the faculty
   * Step 7: check if the same offered course same section in same registered semester exists
   * Step 8: get the schedules of the faculties
   * Step 9: check if the faculty is available at that time. If not then throw error
   * Step 10: create the offered course
   */

  const isRegisteredSemesterExists =
    await semesterRegistrationService.findByProperty(
      "_id",
      semesterRegistration.toString(),
    );
  // get academic semester from db by registered semester
  const academicSemester = isRegisteredSemesterExists?.academicSemester?._id;
  if (!isRegisteredSemesterExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Registered Semester not found");
  }

  const isAcademicFacultyExists = await academicFacultyService.findByProperty(
    "_id",
    academicFaculty.toString(),
  );
  if (!isAcademicFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic Faculty not found");
  }

  const isAcademicDepartmentExists =
    await academicDepartmentService.findByProperty(
      "_id",
      academicDepartment.toString(),
    );
  if (!isAcademicDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic Department not found");
  }

  const isCourseExists = await courseService.findByProperty(
    "_id",
    course.toString(),
  );
  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Course not found");
  }

  const isFacultyExists = await facultyService.findByProperty(
    "_id",
    faculty.toString(),
  );
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty not found");
  }

  // option-1: check if the department is belong to the faculty
  const isDepartmentBelongToFaculty =
    isAcademicDepartmentExists.academicFaculty._id.toString() ===
    isAcademicFacultyExists._id.toString();
  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This '${isAcademicDepartmentExists.name}' is not belong to this '${isAcademicFacultyExists.name}'`,
    );
  }

  // option-2: check if the department is belong to the faculty
  // const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
  //   _id: academicDepartment,
  //   academicFaculty,
  // });

  // if (!isDepartmentBelongToFaculty) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     `This ${isAcademicDepartmentExists.name} is not belong to this ${isAcademicFacultyExists.name}`,
  //   );
  // }

  // check if the same offered course same section in same registered semester exists
  const isSectionAlreadyExists = await OfferedCourse.findOne({
    semesterRegistration,
    course,
    section,
  });
  if (isSectionAlreadyExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Offered course with same section already exists",
    );
  }

  // get the schedules of the faculties
  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select("days startTime endTime");

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty is not available at that time ! Choose other time or day`,
    );
  }

  const result = await OfferedCourse.create({
    ...payload,
    academicSemester,
  });
  return result;
};

// get all
const getAll = (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(
    OfferedCourse.find()
      .populate("semesterRegistration")
      .populate("academicSemester")
      .populate("academicFaculty")
      .populate("academicDepartment")
      .populate("course")
      .populate("faculty"),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();
  return offeredCourseQuery.modelQuery;
};

// get single
const findByProperty = (key: string, value: string) => {
  if (key === "_id") {
    if (!isValidObjectId(value)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid objectId");
    }
    return OfferedCourse.findById(value);
  } else {
    return OfferedCourse.findOne({ [key]: value });
  }
};

// update
const updateSingle = async (id: string, payload: TOfferedCourse) => {
  /**
   * Step 1: check if the offered course exists
   * Step 2: check if the faculty exists
   * Step 3: check if the semester registration status is upcoming
   * Step 4: check if the faculty is available at that time. If not then throw error
   * Step 5: update the offered course
   */

  const { faculty, days, startTime, endTime } = payload || {};

  // check the offered course exists on the database
  const isOfferedCourseExists = await findByProperty("_id", id);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered course not found");
  }

  // check the faculty is exists on the database
  const isFacultyExists = await facultyService.findByProperty(
    "_id",
    faculty.toString(),
  );
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty not found");
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration;

  // check the semester registration status is "UPCOMING" or not
  const semesterRegistrationStatus =
    await semesterRegistrationService.findByProperty(
      "_id",
      semesterRegistration.toString(),
    );

  if (semesterRegistrationStatus?.status !== RegistrationStatus.UPCOMING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not update this offered course as it is '${semesterRegistrationStatus?.status}'`,
    );
  }
  // get the schedules of the faculties
  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select("days startTime endTime");

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty is not available at that time ! Choose other time or day`,
    );
  }

  return OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

// delete
const deleteSingle = async (id: string) => {
  /**
   * Step 1: check if the offered course exists
   * Step 2: check if the semester registration status is upcoming
   * Step 3: delete the offered course
   */

  // check the offered course exists on the database
  const isOfferedCourseExists = await findByProperty("_id", id);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered course not found");
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration;

  // check the semester registration status is "UPCOMING" or not
  const semesterRegistrationStatus =
    await semesterRegistrationService.findByProperty(
      "_id",
      semesterRegistration.toString(),
    );

  if (semesterRegistrationStatus?.status !== RegistrationStatus.UPCOMING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered course can not delete! because the semester '${semesterRegistrationStatus?.status}'`,
    );
  }

  return OfferedCourse.findByIdAndDelete(id);
};

export default {
  create,
  getAll,
  findByProperty,
  updateSingle,
  deleteSingle,
};
