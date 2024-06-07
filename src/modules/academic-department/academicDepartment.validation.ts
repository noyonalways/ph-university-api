import mongoose from "mongoose";
import { z } from "zod";

const createAcademicDepartmentSchema = z
  .object({
    body: z.object({
      name: z
        .string({
          invalid_type_error: "academic department name must be string",
          required_error: "academic department name is required",
        })
        .min(3, "academic faculty name must be at least 3 characters"),
      academicFaculty: z
        .string({
          invalid_type_error: "academic faculty must be string",
          required_error: "academic faculty id is required",
        })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: "Invalid course ID",
        }),
    }),
  })
  .strict();

const updateAcademicDepartmentSchema = z
  .object({
    body: z.object({
      name: z
        .string({
          invalid_type_error: "academic department name must be string",
          required_error: "academic department name is required",
        })
        .min(3, "academic faculty name must be at least 3 characters")
        .optional(),
      academicFaculty: z
        .string({
          invalid_type_error: "academic faculty must be string",
          required_error: "academic faculty id is required",
        })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: "Invalid course ID",
        })
        .optional(),
    }),
  })
  .strict();

export { createAcademicDepartmentSchema, updateAcademicDepartmentSchema };
