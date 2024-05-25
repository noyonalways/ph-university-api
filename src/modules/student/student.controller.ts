import { NextFunction, Request, Response } from "express";
import studentService from "./student.service";
import { IStudent } from "./student.interface";
import { sendResponse } from "../../utils";

const getAll = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const students: IStudent[] = await studentService.getAll();

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Student data retrieved successfully",
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

const getSingle = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
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

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Student data retrieved successfully",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSingle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const result = await studentService.deleteSingle(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Student deleted successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export default { getAll, getSingle, deleteSingle };
