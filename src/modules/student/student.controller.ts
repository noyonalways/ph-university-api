import { NextFunction, Request, Response } from "express";
import studentService from "./student.service";
import { IStudent } from "./student.interface";

const getAll = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const students: IStudent[] = await studentService.getAll();
    return res.status(200).json({
      status: true,
      message: "Student data retrieved successfully",
      count: students.length,
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
      return res.status(404).json({
        status: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      status: true,
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
    const student: IStudent | null = await studentService.findByProperty(
      "id",
      id,
    );

    if (!student) {
      return res.status(404).json({
        status: false,
        message: "Student not found",
      });
    }

    const result = await studentService.deleteSingle(id);
    return res.status(202).json({
      status: true,
      message: "Student deleted successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export default { getAll, getSingle, deleteSingle };
