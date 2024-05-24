import config from "../../config";
// import { customError } from "../../utils";
import { IStudent } from "../student/student.interface";
import Student from "../student/student.model";
import { IUser } from "./user.interface";
import User from "./user.model";

const create = async (password: string, studentData: IStudent) => {
  // if (await Student.isUserExists(data.email)) {
  //   throw customError(400, "Email already exists");
  // }

  // if password is not given, use default password
  const userData: Partial<IUser> = {};
  userData.password = password || (config.default_password_user as string);

  // set student role
  userData.role = "student";

  // set manually generated id
  userData.id = "2030100001";

  // create a user
  const newUser = await User.create(userData); // built-in static method

  // create a student
  if (Object.keys(newUser).length) {
    studentData.id = newUser.id;
    studentData.user = newUser._id; // reference _id

    // create a student
    const newStudent = await Student.create(studentData);
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
