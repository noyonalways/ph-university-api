import mongoose from "mongoose";
import { z } from "zod";

const preRequisiteCoursesSchema = z.object({
  course: z
    .string({
      required_error: "course is required",
      invalid_type_error: "course must be string",
    })
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid course ID",
    }),
});

export const createCourseValidationSchema = z.object({
  body: z
    .object({
      title: z
        .string({
          required_error: "title is required",
          invalid_type_error: "title must be string",
        })
        .min(1, "title is required"),
      prefix: z
        .string({
          required_error: "prefix is required",
          invalid_type_error: "prefix must be string",
        })
        .min(1, "prefix is required"),
      code: z
        .number({
          required_error: "code is required",
          invalid_type_error: "code must be number",
        })
        .int(),
      credits: z
        .number({
          required_error: "credits is required",
          invalid_type_error: "credits must be number",
        })
        .min(0, "credits is required"),
      preRequisiteCourses: z.array(preRequisiteCoursesSchema).optional(),
    })
    .strict(),
});

export const updateCourseValidationSchema = z.object({
  body: z
    .object({
      title: z
        .string({
          required_error: "title is required",
          invalid_type_error: "title must be string",
        })
        .min(1, "title is required")
        .optional(),
      prefix: z
        .string({
          required_error: "prefix is required",
          invalid_type_error: "prefix must be string",
        })
        .min(1, "prefix is required")
        .optional(),
      code: z
        .number({
          required_error: "code is required",
          invalid_type_error: "code must be number",
        })
        .int()
        .optional(),
      credits: z
        .number({
          required_error: "credits is required",
          invalid_type_error: "credits must be number",
        })
        .min(0, "credits is required")
        .optional(),
      preRequisiteCourses: z.array(preRequisiteCoursesSchema).optional(),
    })
    .strict(),
});

export const courseFacultyValidationSchema = z.object({
  body: z.object({
    faculties: z.array(
      z
        .string({
          required_error: "faculty id is required",
          invalid_type_error: "faculty id must be string",
        })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: "Invalid faculty ID",
        }),
    ),
  }),
});
