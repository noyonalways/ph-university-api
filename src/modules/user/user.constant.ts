import { TStatus, TUserRoles } from "./user.interface";

export const USER_ROLE = {
  superAdmin: "super-admin",
  admin: "admin",
  faculty: "faculty",
  student: "student",
} as const;

export const UserRoles: TUserRoles[] = [
  "admin",
  "faculty",
  "student",
  "super-admin",
];
export const UserStatus: TStatus[] = ["blocked", "in-progress"];
