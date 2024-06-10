import httpStatus from "http-status";
import { catchAsync, sendResponse } from "../../utils";
import offeredCourseService from "./offeredCourse.service";

// create
const create = catchAsync(async (req, res) => {
  const result = await offeredCourseService.create(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Offered Course created successfully",
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req, res) => {
  const result = await offeredCourseService.getAll(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offered Courses retrieved successfully",
    data: result,
  });
});

// get single
const getSingle = catchAsync(async (req, res) => {
  const { id } = req.params;
  const offeredCourse = await offeredCourseService.findByProperty("_id", id);

  if (!offeredCourse) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Offered Course not found",
      data: undefined,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offered Course retrieved successfully",
    data: offeredCourse,
  });
});

// update
const updateSingle = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await offeredCourseService.updateSingle(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offered Course updated successfully",
    data: result,
  });
});

// delete
const deleteSingle = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await offeredCourseService.deleteSingle(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offered Course deleted successfully",
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
