import httpStatus from "http-status";
import { catchAsync, sendResponse } from "../../utils";
import semesterRegistrationService from "./semesterRegistration.service";

const create = catchAsync(async (req, res) => {
  const result = await semesterRegistrationService.create(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Course created successfully",
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  const result = await semesterRegistrationService.getAll(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Courses retrieved successfully",
    data: result,
  });
});

export default {
  create,
  getAll,
};
