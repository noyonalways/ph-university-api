import { TStatus, TUserRoles } from "./user.interface";

export const USER_ROLE = {
  admin: "admin",
  faculty: "faculty",
  student: "student",
} as const;

export const UserRoles: TUserRoles[] = ["admin", "faculty", "student"];
export const UserStatus: TStatus[] = ["blocked", "in-progress"];
