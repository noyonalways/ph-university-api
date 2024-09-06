import { catchAsync, sendResponse } from "../../utils";
import studentService from "./student.service";

const getAll = catchAsync(async (req, res) => {
  const { meta, result } = await studentService.getAll(req.query);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student data retrieved successfully",
    meta,
    data: result,
  });
});

const getSingle = catchAsync(async (req, res) => {
  const { id } = req.params;

  const student = await studentService.findByProperty("_id", id);

  if (!student) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Student not found",
      data: undefined,
    });
  }

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student data retrieved successfully",
    data: student,
  });
});

// update student
const updateSingle = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { student } = req.body;

  const result = await studentService.updateSingle(id, student);
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student updated successfully",
    data: result,
  });
});

// delete student
const deleteSingle = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await studentService.deleteSingle(id);
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student deleted successfully",
    data: result,
  });
});

export default {
  getAll,
  getSingle,
  updateSingle,
  deleteSingle,
};
