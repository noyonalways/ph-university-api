import mongoose from "mongoose";
import { z } from "zod";

// Function to check if the first letter is capitalized
// const isCapitalized = (str: string) => {
//   if (typeof str !== "string" || str.length === 0) {
//     return false;
//   }
//   return str.charAt(0) === str.charAt(0).toUpperCase();
// };

// Function to capitalize the first letter of a string
const capitalize = (str: string) => {
  if (typeof str !== "string" || str.length === 0) {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Define the Zod schema for IUserName
const createUserNameValidationSchema = z.object(
  {
    firstName: z
      .string({ message: "firstName is required" })
      .min(3, "firstName must be more than 3 characters")
      .max(20, "firstName can't be more than 20 characters")
      .transform(capitalize),
    // .refine(isCapitalized, { message: "firstName must be capitalized" })
    middleName: z.string().optional(),
    lastName: z.string().max(20, "lastName can't be more than 20 characters"),
  },
  { message: "name is required" },
);

// Define the Zod schema for IGuardian
const createGuardianValidationSchema = z.object({
  fatherName: z.string(),
  fatherOccupation: z.string(),
  fatherContactNo: z.string(),
  motherName: z.string(),
  motherOccupation: z.string(),
  motherContactNo: z.string(),
});

// Define the Zod schema for ILocalGuardian
const createLocalGuardianValidationSchema = z.object({
  name: z.string(),
  occupation: z.string(),
  contactNo: z.string(),
  address: z.string(),
});

// Define the Zod schema for IStudent
const createStudentValidationSchema = z.object({
  body: z
    .object({
      password: z
        .string({
          invalid_type_error: "password must be string",
        })
        .min(8, { message: "password must be at least 8 characters" })
        .max(20, { message: "password can not be more than 20 characters" })
        .optional(),
      student: z.object({
        name: createUserNameValidationSchema,
        gender: z.enum(["male", "female", "other"]),
        dateOfBirth: z.string().optional(),
        email: z
          .string({ message: "email is required" })
          .email({ message: "provide a valid email address" }),
        contactNo: z.string(),
        emergencyContactNo: z.string(),
        bloodGroup: z
          .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
          .optional(),
        presentAddress: z.string(),
        permanentAddress: z.string(),
        guardian: createGuardianValidationSchema,
        localGuardian: createLocalGuardianValidationSchema,
        profileImage: z
          .string()
          .url({ message: "profileImage must be a valid image url" })
          .optional(),
        admissionSemester: z
          .string({
            invalid_type_error: "admission semester must be string",
            required_error: "admission semester id is required",
          })
          .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid course ID",
          }),
        academicDepartment: z
          .string({
            invalid_type_error: "academic department must be string",
            required_error: "academic department id is required",
          })
          .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid course ID",
          }),
      }),
    })
    .strict(),
});

const updateUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(3, "firstName must be more than 3 characters")
    .max(20, "firstName can't be more than 20 characters")
    .transform(capitalize)
    .optional(),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .max(20, "lastName can't be more than 20 characters")
    .optional(),
});

const updateGuardianValidationSchema = z.object({
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  fatherContactNo: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  motherContactNo: z.string().optional(),
});

const updateLocalGuardianValidationSchema = z.object({
  name: z.string().optional(),
  occupation: z.string().optional(),
  contactNo: z.string().optional(),
  address: z.string().optional(),
});

const updateStudentValidationSchema = z.object({
  body: z
    .object({
      student: z
        .object({
          name: updateUserNameValidationSchema.optional(),
          gender: z.enum(["male", "female", "other"]).optional(),
          dateOfBirth: z.string().optional(),
          email: z
            .string()
            .email({ message: "provide a valid email address" })
            .optional(),
          contactNo: z.string().optional(),
          emergencyContactNo: z.string().optional(),
          bloodGroup: z
            .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
            .optional(),
          presentAddress: z.string().optional(),
          permanentAddress: z.string().optional(),
          guardian: updateGuardianValidationSchema.optional(),
          localGuardian: updateLocalGuardianValidationSchema.optional(),
          profileImage: z
            .string()
            .url({ message: "profileImage must be a valid image url" })
            .optional(),
          admissionSemester: z
            .string({
              invalid_type_error: "admission semester must be string",
            })
            .refine((val) => mongoose.Types.ObjectId.isValid(val), {
              message: "Invalid course ID",
            })
            .optional(),
          academicDepartment: z
            .string({
              invalid_type_error: "academic department must be string",
            })
            .refine((val) => mongoose.Types.ObjectId.isValid(val), {
              message: "Invalid course ID",
            })
            .optional(),
        })
        .optional(),
    })
    .strict(),
});

export { createStudentValidationSchema, updateStudentValidationSchema };
