import httpStatus from "http-status";
import { isValidObjectId } from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { CourseSearchableFields } from "./course.constant";
import { TCourse } from "./course.interface";
import Course from "./course.model";

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

const updateSingle = async (id: string, payload: TCourse) => {
  const { preRequisiteCourses, ...remainingCourseData } = payload;

  return;
};

const deleteSingle = async (id: string) => {
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

export default {
  create,
  getAll,
  findByProperty,
  // updateSingle,
  deleteSingle,
};
