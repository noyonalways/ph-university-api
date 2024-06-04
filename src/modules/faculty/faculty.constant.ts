import { TBloodGroups, TGender } from "./faculty.interface";

export const Gender: TGender[] = ["male", "female", "other"];
export const BloodGroups: TBloodGroups[] = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

export const FacultySearchableFields = [
  "email",
  "id",
  "contactNo",
  "emergencyContactNo",
  "name.firstName",
  "name.lastName",
  "name.middleName",
];
