import { NextFunction, Request, Response } from "express";
// import studentSchema from "../student/student.validation";
import userService from "../user/user.service";

const create = async (req: Request, res: Response, next: NextFunction) => {
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
    return res.status(201).json({
      status: true,
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
