import { NextFunction, Request, Response } from "express";
import studentService from "./student.service";
import { IStudent } from "./student.interface";
import studentSchema from "./student.validate";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = studentSchema.safeParse(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.issues[0].message,
      });
    }
    const result: IStudent = await studentService.create({ ...data });
    return res.status(201).json({
      status: true,
      message: "Student created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

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
  const { studentId } = req.params;
  try {
    const student: IStudent | null = await studentService.findByProperty(
      "studentId",
      studentId,
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
    const { studentId } = req.params;
    const student: IStudent | null = await studentService.findByProperty(
      "studentId",
      studentId,
    );

    if (!student) {
      return res.status(404).json({
        status: false,
        message: "Student not found",
      });
    }

    const result = await studentService.deleteSingle(studentId);
    return res.status(202).json({
      status: true,
      message: "Student deleted successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export default { create, getAll, getSingle, deleteSingle };
