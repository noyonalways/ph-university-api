import httpStatus from "http-status";
import mongoose from "mongoose";
import config from "../../config";
import { customError } from "../../utils";
import academicDepartmentService from "../academic-department/academicDepartment.service";
import academicSemesterService from "../academic-semester/academicSemester.service";
import { IStudent } from "../student/student.interface";
import Student from "../student/student.model";
import { IUser } from "./user.interface";
import User from "./user.model";
import generateStudentId from "./user.utils";

const create = async (password: string, payload: IStudent) => {
  // check if the user has already been created with provide email
  if (await Student.isUserExists(payload.email)) {
    throw customError(false, httpStatus.BAD_REQUEST, "Email already exists");
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
    throw customError(false, 404, "Admission semester not found");
  }

  const academicDepartment = await academicDepartmentService.findByProperty(
    "_id",
    payload.academicDepartment.toString(),
  );

  if (!academicDepartment) {
    throw customError(false, 404, "Admission Department not found");
  }

  const session = await mongoose.startSession();

  try {
    // start transaction
    session.startTransaction();

    // set student role
    userData.role = "student";
    userData.id = await generateStudentId(admissionSemester);

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // built-in static method
    if (!newUser.length) {
      throw customError(false, httpStatus.BAD_REQUEST, "Failed to create user");
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference _id

    // create a student (transaction-2)
    const newStudent = await Student.create([payload], { session });
    if (!newStudent.length) {
      throw customError(
        false,
        httpStatus.BAD_REQUEST,
        "Failed to create student",
      );
    }

    // commit transaction and end session
    await session.commitTransaction();
    await session.endSession();

    return newStudent[0];
  } catch (err) {
    // abort transaction and end session
    await session.abortTransaction();
    await session.endSession();
    console.log(err);
  }
};

export default {
  create,
};
