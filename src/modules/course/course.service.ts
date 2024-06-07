import httpStatus from "http-status";
import mongoose, { isValidObjectId } from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { CourseSearchableFields } from "./course.constant";
import { TCourse, TCourseFaculty } from "./course.interface";
import { Course, CourseFaculty } from "./course.model";

const create = (payload: TCourse) => {
  return Course.create(payload);
};

const getAll = (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate("preRequisiteCourses.course"),
    query,
  )
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  return courseQuery.modelQuery;
};

const findByProperty = (key: string, value: string) => {
  if (key === "_id") {
    if (!isValidObjectId(value)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid objectId");
    }
    return Course.findById(value).populate("preRequisiteCourses.course");
  } else {
    return Course.findOne({ [key]: value }).populate(
      "preRequisiteCourses.course",
    );
  }
};

const updateSingle = async (id: string, payload: Partial<TCourse>) => {
  if (!(await findByProperty("_id", id))) {
    throw new AppError(httpStatus.NOT_FOUND, "course not found");
  }

  const { preRequisiteCourses, ...courseRemainingData } = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Step 1: Basic course info update
    const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseRemainingData,
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!updatedBasicCourseInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course!");
    }

    // Step 2: Check if there are any prerequisite courses to update
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      // Filter out the deleted fields
      const deletedPreRequisites = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);

      const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisites } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!deletedPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course!");
      }

      // Filter out the new course fields
      const newPreRequisites = preRequisiteCourses.filter(
        (el) => el.course && !el.isDeleted,
      );

      // Step 3: Check if the new prerequisite courses exist
      const newPreRequisiteCourseIds = newPreRequisites.map((el) => el.course);
      const existingCourses = await Course.find({
        _id: { $in: newPreRequisiteCourseIds },
      }).session(session);

      const existingCourseIds = new Set(
        existingCourses.map((course) => course._id.toString()),
      );

      // Check if all new prerequisite courses exist
      newPreRequisiteCourseIds.forEach((courseId) => {
        if (!existingCourseIds.has(courseId.toString())) {
          throw new AppError(
            httpStatus.NOT_FOUND,
            `Course with id ${courseId} not found`,
          );
        }
      });

      // Add valid new prerequisite courses
      const newPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            preRequisiteCourses: {
              $each: newPreRequisites,
            },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!newPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course!");
      }
    }

    await session.commitTransaction();
    await session.endSession();

    const result = await Course.findById(id).populate(
      "preRequisiteCourses.course",
    );

    return result;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};

const deleteSingle = async (id: string) => {
  if (!isValidObjectId(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid objectId");
  }
  const deleted = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!deleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Course not found");
  }
  return deleted;
};

const assignFacultiesWithCourse = async (
  courseId: string,
  payload: TCourseFaculty,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    courseId,
    {
      course: courseId,
      $addToSet: { faculties: { $each: payload } },
    },
    { upsert: true, new: true },
  );

  return result;
};

const removeFacultiesFromCourse = async (
  courseId: string,
  payload: TCourseFaculty,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    courseId,
    {
      course: courseId,
      $pull: { faculties: { $in: payload } },
    },
    { new: true },
  );

  return result;
};

export default {
  create,
  getAll,
  findByProperty,
  updateSingle,
  deleteSingle,
  assignFacultiesWithCourse,
  removeFacultiesFromCourse,
};
