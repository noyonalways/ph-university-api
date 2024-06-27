import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { catchAsync, sendResponse } from "../../utils";
import userService from "../user/user.service";

const createStudent = catchAsync(async (req, res) => {
  if (!req.file?.path) {
    throw new AppError(httpStatus.BAD_REQUEST, "Image file is required");
  }

  const { password, student } = req.body;

  const result = await userService.createStudent(
    req.file?.path,
    password,
    student,
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Student created successfully",
    data: result,
  });
});

const createFaculty = catchAsync(async (req, res) => {
  if (!req.file?.path) {
    throw new AppError(httpStatus.BAD_REQUEST, "Image file is required");
  }
  const { password, faculty } = req.body;

  const result = await userService.createFaculty(
    req.file?.path,
    password,
    faculty,
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Faculty created successfully",
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  if (!req.file?.path) {
    throw new AppError(httpStatus.BAD_REQUEST, "Image file is required");
  }
  const { password, admin } = req.body;

  const result = await userService.createAdmin(req.file?.path, password, admin);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const result = await userService.getMe(req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

// change status
const changeStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await userService.changeStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status changed successfully",
    data: result,
  });
});

export default {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
};
