import mongoose from "mongoose";
import { z } from "zod";
import { SemesterRegistrationStatus } from "./semesterRegistration.constant";

export const createSemesterRegistrationValidationSchema = z
  .object({
    body: z
      .object({
        academicSemester: z
          .string()
          .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid course ID",
          }),
        status: z.enum([
          ...(SemesterRegistrationStatus as [string, ...string[]]),
        ]),
        startDate: z
          .string({
            required_error: "start date is required",
          })
          .datetime({
            message: "start date is not valid",
          }),
        endDate: z
          .string({
            required_error: "end date is required",
          })
          .datetime({
            message: "end date is not valid",
          }),
        minCredit: z.number({
          required_error: "min credit is required",
          invalid_type_error: "min credit must be a number",
        }),
        maxCredit: z.number({
          required_error: "max credit is required",
          invalid_type_error: "max credit must be a number",
        }),
      })
      .strict(),
  })
  .strict();

export const updateSemesterRegistrationValidationSchema = z
  .object({
    body: z
      .object({
        academicSemester: z
          .string()
          .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid course ID",
          })
          .optional(),
        status: z
          .enum([...(SemesterRegistrationStatus as [string, ...string[]])])
          .optional(),
        startDate: z
          .string({
            required_error: "start date is required",
          })
          .datetime({
            message: "start date is not valid",
          })
          .optional(),
        endDate: z
          .string({
            required_error: "start date is required",
          })
          .datetime({
            message: "start date is not valid",
          })
          .optional(),
        minCredit: z
          .number({
            required_error: "min credit is required",
            invalid_type_error: "min credit must be a number",
          })
          .optional(),
        maxCredit: z
          .number({
            required_error: "max credit is required",
            invalid_type_error: "max credit must be a number",
          })
          .optional(),
      })
      .strict(),
  })
  .strict();
