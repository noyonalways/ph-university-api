import mongoose from "mongoose";
import { z } from "zod";
import { Days } from "./offeredCourse.constant";

const DaysValidation = z.array(
  z.enum([...Days] as [string, ...string[]], {
    required_error: "days is required",
    invalid_type_error: "days is must be string",
  }),
);

const checkTimeValidation = (time: string) => {
  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // 00-09 10-19 20-23
  return regex.test(time);
};

const startAndEndTimeValidation = (body: Record<string, unknown>) => {
  // start time: 10:30 => 1970-01-01T10:30
  // end time: 12:30 => 1970-01-01T12:30

  const start = new Date(`1970-01-01T${body.startTime}:00`);
  const end = new Date(`1970-01-01T${body.endTime}:00`);
  return end > start;
};

export const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z
        .string({
          required_error: "semester registration is required",
          invalid_type_error: "semester registration must be string",
        })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: "invalid semester registration id",
        }),
      academicFaculty: z
        .string({
          required_error: "academic faculty is required",
          invalid_type_error: "academic faculty must be string",
        })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: "invalid academic faculty id",
        }),
      academicDepartment: z
        .string({
          required_error: "academic department is required",
          invalid_type_error: "academic department must be string",
        })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: "invalid academic department id",
        }),
      course: z
        .string({
          required_error: "course is required",
          invalid_type_error: "course must be string",
        })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: "invalid course id",
        }),
      faculty: z
        .string({
          required_error: "faculty is required",
          invalid_type_error: "faculty must be string",
        })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: "invalid course id",
        }),
      maxCapacity: z
        .number({
          required_error: "max capacity is required",
          invalid_type_error: "max capacity must be number",
        })
        .int({ message: "max capacity must be a integer" }),
      section: z
        .number({
          required_error: "section is required",
          invalid_type_error: "section must be number",
        })
        .int({ message: "section must be a integer" }),
      days: DaysValidation,
      startTime: z
        .string({
          required_error: "start time is required",
          invalid_type_error: "start time must be string",
        })
        .refine(checkTimeValidation, {
          message: "Invalid time format , expected 'HH:MM' in 24 hours format",
        }),
      endTime: z
        .string({
          required_error: "end time is required",
          invalid_type_error: "end time must be string",
        })
        .refine(checkTimeValidation, {
          message: "Invalid time format , expected 'HH:MM' in 24 hours format",
        }),
    })
    .strict()
    .refine(startAndEndTimeValidation, {
      message: "start time should be before end time",
    }),
});

export const updateOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      faculty: z
        .string({
          required_error: "faculty is required",
          invalid_type_error: "faculty must be string",
        })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: "invalid course id",
        }),
      maxCapacity: z
        .number({
          required_error: "max capacity is required",
          invalid_type_error: "max capacity must be number",
        })
        .int({ message: "max capacity must be a integer" }),
      days: DaysValidation,
      startTime: z
        .string({
          required_error: "start time is required",
          invalid_type_error: "start time must be string",
        })
        .refine(checkTimeValidation, {
          message: "Invalid time format , expected 'HH:MM' in 24 hours format",
        }),
      endTime: z
        .string({
          required_error: "end time is required",
          invalid_type_error: "end time must be string",
        })
        .refine(checkTimeValidation, {
          message: "Invalid time format , expected 'HH:MM' in 24 hours format",
        }),
    })
    .strict()
    .refine(startAndEndTimeValidation, {
      message: "start time should be before end time",
    }),
});
