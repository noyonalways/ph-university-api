import httpStatus from "http-status";
import { catchAsync, sendResponse } from "../../utils";
import academicSemesterService from "./academicSemester.service";
const create = catchAsync(async (req, res) => {
  const result = await academicSemesterService.create(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Academic Semester created successfully",
    data: result,
  });
});

export default {
  create,
};
