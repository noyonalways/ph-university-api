import { catchAsync, sendResponse } from "../../utils";
import { IStudent } from "./student.interface";
import studentService from "./student.service";

const getAll = catchAsync(async (req, res) => {
  const students: IStudent[] = await studentService.getAll(req.query);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student data retrieved successfully",
    data: students,
  });
});

const getSingle = catchAsync(async (req, res) => {
  const { id } = req.params;

  const student: IStudent | null = await studentService.findByProperty(
    "id",
    id,
  );

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
