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
      .min(1, "firstName must be more than 1 characters")
      .max(20, "firstName can't be more than 20 characters")
      .transform(capitalize),
    // .refine(isCapitalized, { message: "firstName must be capitalized" })
    middleName: z.string().optional(),
    lastName: z
      .string()
      .max(20, "lastName can't be more than 20 characters")
      .transform(capitalize),
  },
  { message: "name is required" },
);

// create faculty zod validation schema
export const createFacultyValidationSchema = z.object({
  body: z
    .object({
      password: z
        .string({
          invalid_type_error: "password must be string",
        })
        .min(8, { message: "password must be at least 8 characters" })
        .max(20, { message: "password can not be more than 20 characters" })
        .optional(),
      faculty: z.object(
        {
          name: createUserNameValidationSchema,
          designation: z
            .string({
              invalid_type_error: "designation must be string",
              required_error: "designation is required",
            })
            .min(3, "designation must be at least 3 characters"),
          gender: z.enum(["male", "female", "other"]),
          dateOfBirth: z.string().optional(),
          email: z
            .string({
              invalid_type_error: "email must be string",
              required_error: "email is required",
            })
            .email({ message: "provide a valid email address" }),
          contactNo: z.string(),
          emergencyContactNo: z.string(),
          bloodGroup: z
            .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
            .optional(),
          presentAddress: z.string(),
          permanentAddress: z.string(),
          academicDepartment: z
            .string({
              invalid_type_error: "academic department must be string",
              required_error: "academic department id is required",
            })
            .min(10, "academic department must be at least 10 characters"),
        },
        {
          invalid_type_error: "faculty must be object",
          required_error: "faculty is required",
        },
      ),
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

export const updateFacultyValidationSchema = z.object({
  body: z
    .object({
      faculty: z
        .object({
          name: updateUserNameValidationSchema.optional(),
          designation: z
            .string({
              invalid_type_error: "designation must be string",
              required_error: "designation is required",
            })
            .min(3, "designation must be at least 3 characters")
            .optional(),
          gender: z.enum(["male", "female", "other"]).optional(),
          dateOfBirth: z.string().optional(),
          email: z
            .string({
              invalid_type_error: "email must be string",
              required_error: "email is required",
            })
            .email({ message: "provide a valid email address" })
            .optional(),
          contactNo: z.string().optional(),
          emergencyContactNo: z.string().optional(),
          bloodGroup: z
            .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
            .optional(),
          presentAddress: z.string().optional(),
          permanentAddress: z.string().optional(),
          profileImage: z
            .string()
            .url({ message: "profileImage must be a valid image url" })
            .optional(),
          academicDepartment: z
            .string({
              invalid_type_error: "academic department must be string",
            })
            .min(10, "academic department must be at least 10 characters")
            .optional(),
        })
        .optional(),
    })
    .strict(),
});
