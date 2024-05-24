import { Model, Types } from "mongoose";
export interface IUserName {
  firstName: string;
  middleName?: string;
  lastName: string;
}

export interface IGuardian {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
}

export interface ILocalGuardian {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
}

export interface IStudent {
  id: string;
  user: Types.ObjectId;
  name: IUserName;
  gender: "male" | "female" | "other";
  dateOfBirth?: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  presentAddress: string;
  permanentAddress: string;
  guardian: IGuardian;
  localGuardian: ILocalGuardian;
  profileImage?: string;
  isDeleted?: boolean;
}

// for creating mongoose custom instance methods
// export interface IStudentMethods {
//   isUserExists(email: string): Promise<IStudent | null>;
// }

// for creating mongoose custom instance methods
// export type TStudentModel = Model<
//   IStudent,
//   Record<string, never>,
//   IStudentMethods
// >;

// for creating mongoose custom static methods
export interface IStudentModel extends Model<IStudent> {
  isUserExists(email: string): Promise<IStudent | null>;
}
