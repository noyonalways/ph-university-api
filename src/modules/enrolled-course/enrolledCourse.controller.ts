import { catchAsync, sendResponse } from "../../utils";
import enrolledCourseService from "./enrolledCourse.service";

const createEnrolledCourse = catchAsync(async (req, res) => {
  const result = await enrolledCourseService.createEnrolledCourse(
    req.user,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Enrolled Course created successfully",
    data: result,
  });
});

const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
  const result = await enrolledCourseService.updateEnrolledCourseMarks(
    req.user,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Course marks updated successfully",
    data: result,
  });
});

export default {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
};
