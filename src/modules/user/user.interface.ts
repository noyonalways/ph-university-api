import { Document, Model } from "mongoose";

export type TUserRoles = "admin" | "faculty" | "student" | "super-admin";
export type TStatus = "in-progress" | "blocked";

export interface IUser {
  id: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangeAt?: Date;
  role: TUserRoles;
  status: TStatus;
  isDeleted: boolean;
}

export interface UserModel extends Model<IUser> {
  isUserExistsByCustomId(id: string): Promise<IUser & Document>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}
