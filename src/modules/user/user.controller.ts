// import studentSchema from "../student/student.validation";
import userService from "../user/user.service";
import { sendResponse } from "../../utils";
import { RequestHandler } from "express";

const create: RequestHandler = async (req, res, next) => {
  try {
    const { password, student: studentData } = req.body;
    // const { data, error } = studentSchema.safeParse(studentData);
    // if (error) {
    //   return res.status(400).json({
    //     status: false,
    //     message: error.issues[0].message,
    //   });
    // }

    const result = await userService.create(password, studentData);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Student created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
};
