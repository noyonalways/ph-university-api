import httpStatus from "http-status";
import { catchAsync, sendResponse } from "../../utils";
import academicDepartmentService from "./academicDepartment.service";

// create a academic department
const create = catchAsync(async (req, res) => {
  const result = await academicDepartmentService.create(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Academic Department created successfully",
    data: result,
  });
});

// get all academic departments
const getAll = catchAsync(async (req, res) => {
  const result = await academicDepartmentService.getAll(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic Departments retrieved successfully",
    data: result,
  });
});

// get single department
const getSingle = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const result = await academicDepartmentService.findByProperty(
    "_id",
    departmentId,
  );

  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Academic Department not found",
      data: undefined,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic Department data retrieved successfully",
    data: result,
  });
});

// update single department
const updateSingle = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const result = await academicDepartmentService.updateSingle(
    departmentId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic Department updated successfully",
    data: result,
  });
});

export default {
  create,
  getAll,
  getSingle,
  updateSingle,
};
