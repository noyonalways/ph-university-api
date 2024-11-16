import mongoose from "mongoose";
import { z } from "zod";

export const enrolledCourseValidationSchema = z.object({
  body: z
    .object({
      offeredCourse: z
        .string({
          required_error: "offered course id is required",
          invalid_type_error: "offered course id must be string",
        })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: "invalid offered course id",
        }),
    })
    .strict(),
});

export const updateEnrolledCourseMarksValidationSchema = z.object({
  body: z.object({
    semesterRegistration: z
      .string({
        required_error: "semester registration id is required",
        invalid_type_error: "semester registration id must be string",
      })
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "invalid semester registration id",
      }),
    offeredCourse: z
      .string({
        required_error: "offered course id is required",
        invalid_type_error: "offered course id must be string",
      })
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "invalid offered course id",
      }),
    student: z
      .string({
        required_error: "student id is required",
        invalid_type_error: "student id must be string",
      })
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "invalid student id",
      }),
    courseMarks: z.object({
      classTest1: z
        .number({
          invalid_type_error: "class test 1 marks must be number",
        })
        .optional(),
      classTest2: z
        .number({
          invalid_type_error: "class test 2 marks must be number",
        })
        .optional(),
      midTerm: z
        .number({
          invalid_type_error: "mid term marks must be number",
        })
        .optional(),
      finalTerm: z
        .number({
          invalid_type_error: "final term marks must be number",
        })
        .optional(),
    }),
  }),
});
