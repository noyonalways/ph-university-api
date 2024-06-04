import { catchAsync, sendResponse } from "../../utils";
import facultyService from "./faculty.service";

// get all faculties
const getAll = catchAsync(async (req, res) => {
  const faculties = await facultyService.getAll(req.query);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Faculty data retrieved successfully",
    data: faculties,
  });
});

// get single faculty
const getSingle = catchAsync(async (req, res) => {
  const { id } = req.params;

  const faculty = await facultyService.findByProperty("_id", id);

  if (!faculty) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Faculty not found",
      data: undefined,
    });
  }

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Faculty data retrieved successfully",
    data: faculty,
  });
});

// update faculty
const updateSingle = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { faculty } = req.body;

  const result = await facultyService.updateSingle(id, faculty);
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Faculty updated successfully",
    data: result,
  });
});

// delete faculty
const deleteSingle = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await facultyService.deleteSingle(id);
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Faculty deleted successfully",
    data: result,
  });
});

export default {
  getAll,
  getSingle,
  updateSingle,
  deleteSingle,
};
