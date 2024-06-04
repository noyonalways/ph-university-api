import httpStatus from "http-status";
import mongoose from "mongoose";
import config from "../../config";
import AppError from "../../errors/AppError";
import academicDepartmentService from "../academic-department/academicDepartment.service";
import academicSemesterService from "../academic-semester/academicSemester.service";
import { TFaculty } from "../faculty/faculty.interface";
import Faculty from "../faculty/faculty.model";
import { IStudent } from "../student/student.interface";
import Student from "../student/student.model";
import { IUser } from "./user.interface";
import User from "./user.model";
import { generateFacultyId, generateStudentId } from "./user.utils";

// create a new student
const createStudent = async (password: string, payload: IStudent) => {
  // check if the student has already been created with provide email
  if (await Student.isStudentExists("email", payload.email)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email already exists");
  }

  // if password is not given, use default password
  const userData: Partial<IUser> = {};
  userData.password = password || (config.default_password_user as string);

  // find academic semester info
  const admissionSemester = await academicSemesterService.findByProperty(
    "_id",
    payload.admissionSemester.toString(),
  );

  if (!admissionSemester) {
    throw new AppError(404, "Admission semester not found");
  }

  const academicDepartment = await academicDepartmentService.findByProperty(
    "_id",
    payload.academicDepartment.toString(),
  );

  if (!academicDepartment) {
    throw new AppError(404, "Admission Department not found");
  }

  // set student role
  userData.role = "student";

  const session = await mongoose.startSession();

  try {
    // start transaction
    session.startTransaction();

    // set student id
    userData.id = await generateStudentId(admissionSemester);

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // built-in static method
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference _id

    // create a student (transaction-2)
    const newStudent = await Student.create([payload], { session });
    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create student");
    }

    // commit transaction and end session
    await session.commitTransaction();
    await session.endSession();

    return newStudent[0];
  } catch (err) {
    // abort transaction and end session
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "failed to create student");
  }
};

// create a new faculty
const createFaculty = async (password: string, payload: TFaculty) => {
  // check if the faculty has already been created with provide email
  if (await Faculty.isFacultyExists("email", payload.email)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email already exists");
  }

  // if password is not given, use default password
  const userData: Partial<IUser> = {};
  userData.password = password || (config.default_password_user as string);

  const academicDepartment = await academicDepartmentService.findByProperty(
    "_id",
    payload.academicDepartment.toString(),
  );

  if (!academicDepartment) {
    throw new AppError(404, "Academic Department not found");
  }

  // set student role
  userData.role = "faculty";

  const session = await mongoose.startSession();

  try {
    // start transaction
    session.startTransaction();

    // set faculty id
    userData.id = await generateFacultyId();

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // built-in static method
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference _id

    // create a faculty (transaction-2)
    const newFaculty = await Faculty.create([payload], { session });
    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create faculty");
    }

    // commit transaction and end session
    await session.commitTransaction();
    await session.endSession();

    return newFaculty[0];
  } catch (err) {
    // abort transaction and end session
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "failed to create faculty");
  }
};

export default {
  createStudent,
  createFaculty,
};
