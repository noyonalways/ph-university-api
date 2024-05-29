import httpStatus from "http-status";
import { catchAsync, sendResponse } from "../../utils";
import academicSemesterService from "./academicSemester.service";

// create a new semester
const create = catchAsync(async (req, res) => {
  const result = await academicSemesterService.create(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Academic Semester created successfully",
    data: result,
  });
});

// get all semesters
const getAll = catchAsync(async (req, res) => {
  const result = await academicSemesterService.getAll();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic Semesters retrieved successfully",
    data: result,
  });
});

// get a single semester
const getSingle = catchAsync(async (req, res) => {
  const { semesterId } = req.params;

  const result = await academicSemesterService.findByProperty(
    "_id",
    semesterId,
  );

  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Academic Semester not found",
      data: undefined,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic Semester retrieved successfully",
    data: result,
  });
});

// update a single semester
const updateSingle = catchAsync(async (req, res) => {
  const { semesterId } = req.params;

  const result = await academicSemesterService.updateSingle(
    semesterId,
    req.body,
  );

  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Academic Semester not found",
      data: undefined,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic Semester updated successfully",
    data: result,
  });
});

export default {
  create,
  getAll,
  getSingle,
  updateSingle,
};
