import httpStatus from "http-status";
import { catchAsync, sendResponse } from "../../utils";
import academicFacultyService from "./academicFaculty.service";

// create a academic faculty
const create = catchAsync(async (req, res) => {
  const result = await academicFacultyService.create(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Academic Faculty created successfully",
    data: result,
  });
});

// get all academic faculties
const getAll = catchAsync(async (req, res) => {
  const result = await academicFacultyService.getAll();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic Faculties retrieved successfully",
    data: result,
  });
});

// get single faculty
const getSingle = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await academicFacultyService.findByProperty("_id", facultyId);

  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Academic Faculty not found",
      data: undefined,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic Faculty data retrieved successfully",
    data: result,
  });
});

// update single faculty
const updateSingle = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await academicFacultyService.updateSingle(facultyId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic Faculty updated successfully",
    data: result,
  });
});

export default {
  create,
  getAll,
  getSingle,
  updateSingle,
};
