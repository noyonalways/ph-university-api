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
  // if (await Student.isUserExists(data.email)) {
  //   throw customError(400, "Email already exists");
  // }

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

  // set manually generated id
  // userData.id = "2030100001";

  // set student role
  userData.role = "student";
  userData.id = await generateStudentId(admissionSemester);

  // create a user
  const newUser = await User.create(userData); // built-in static method

  // create a student
  if (Object.keys(newUser).length) {
    payload.id = newUser.id;
    payload.user = newUser._id; // reference _id

    // create a student
    const newStudent = await Student.create(payload);
    return newStudent;
  }

  // const student = new Student({ ...data });
  // mongoose custom instance method
  // if (await student.isUserExists(data.email))
  //   throw customError(400, "Email already exists");
  // return student.save(); // built-in instance method
};

export default {
  create,
};
