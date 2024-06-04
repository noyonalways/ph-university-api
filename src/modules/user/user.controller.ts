// import studentSchema from "../student/student.validation";
import { catchAsync, sendResponse } from "../../utils";
import userService from "../user/user.service";

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;

  const result = await userService.createStudent(password, studentData);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Student created successfully",
    data: result,
  });
});

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty } = req.body;

  const result = await userService.createFaculty(password, faculty);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Faculty created successfully",
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin } = req.body;

  const result = await userService.createAdmin(password, admin);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

export default {
  createStudent,
  createFaculty,
  createAdmin,
};
