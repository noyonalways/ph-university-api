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
const userNameSchema = z.object(
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
const guardianSchema = z.object({
  fatherName: z.string(),
  fatherOccupation: z.string(),
  fatherContactNo: z.string(),
  motherName: z.string(),
  motherOccupation: z.string(),
  motherContactNo: z.string(),
});

// Define the Zod schema for ILocalGuardian
const localGuardianSchema = z.object({
  name: z.string(),
  occupation: z.string(),
  contactNo: z.string(),
  address: z.string(),
});

// Define the Zod schema for IStudent
const studentSchema = z.object({
  body: z.object({
    password: z
      .string({
        invalid_type_error: "password must be string",
      })
      .min(8, { message: "password must be at least 8 characters" })
      .max(20, { message: "password can not be more than 20 characters" })
      .optional(),
    student: z.object({
      name: userNameSchema,
      gender: z.enum(["male", "female", "other"]),
      dateOfBirth: z.string(),
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
      guardian: guardianSchema,
      localGuardian: localGuardianSchema,
      profileImage: z
        .string()
        .url({ message: "profileImage must be a valid image url" })
        .optional(),
    }),
  }),
});

export default studentSchema;
