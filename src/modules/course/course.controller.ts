import httpStatus from "http-status";
import { catchAsync, sendResponse } from "../../utils";
import courseService from "./course.service";

// crate a new course
const create = catchAsync(async (req, res) => {
  const result = await courseService.create(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Course created successfully",
    data: result,
  });
});

// get all courses
const getAll = catchAsync(async (req, res) => {
  const courses = await courseService.getAll(req.query);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Courses retrieved successfully",
    data: courses,
  });
});

// get single course
const getSingle = catchAsync(async (req, res) => {
  const { id } = req.params;

  const course = await courseService.findByProperty("_id", id);

  if (!course) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Course not found",
      data: undefined,
    });
  }

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Faculty data retrieved successfully",
    data: course,
  });
});

const updateSingle = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await courseService.updateSingle(id, req.body);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course updated successfully",
    data: result,
  });
});

// delete single course
const deleteSingle = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await courseService.deleteSingle(id);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course deleted successfully",
    data: result,
  });
});

export default {
  create,
  getAll,
  getSingle,
  updateSingle,
  deleteSingle,
};
