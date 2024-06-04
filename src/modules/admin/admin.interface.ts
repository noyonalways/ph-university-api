import { Model, Types } from "mongoose";

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TBloodGroups =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export type TGender = "male" | "female" | "other";

export type TAdmin = {
  id: string;
  user: Types.ObjectId;
  designation: string;
  name: TUserName;
  gender: TGender;
  dateOfBirth?: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: TBloodGroups;
  presentAddress: string;
  permanentAddress: string;
  profileImage?: string;
  isDeleted?: boolean;
};

export interface TAdminModel extends Model<TAdmin> {
  isAdminExists(key: string, value: string): Promise<TAdmin | null>;
}
