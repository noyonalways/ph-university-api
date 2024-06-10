import httpStatus from "http-status";
import { catchAsync, sendResponse } from "../../utils";
import semesterRegistrationService from "./semesterRegistration.service";

// create
const create = catchAsync(async (req, res) => {
  const result = await semesterRegistrationService.create(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Semester Registration created successfully",
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req, res) => {
  const semesterRegistrations = await semesterRegistrationService.getAll(
    req.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Semester Registrations retrieved successfully",
    data: semesterRegistrations,
  });
});

// get single
const getSingle = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await semesterRegistrationService.findByProperty("_id", id);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Semester Registration not found",
      data: undefined,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Semester Registration retrieved successfully",
    data: result,
  });
});

// update
const updateSingle = catchAsync(async (req, res) => {
  const { id } = req.params;
  const semesterRegistration = await semesterRegistrationService.updateSingle(
    id,
    req.body,
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Semester Registration updated successfully",
    data: semesterRegistration,
  });
});

// delete
const deleteSingle = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await semesterRegistrationService.deleteSingle(id);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Semester Registration delete successfully",
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
