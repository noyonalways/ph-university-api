import { z } from "zod";
import {
  AcademicSemesterCodes,
  AcademicSemesterNames,
  Months,
} from "./academicSemester.constants";

// Zod schema for TAcademicSemester
const academicSemesterSchema = z.object({
  body: z.object({
    name: z.enum([...AcademicSemesterNames] as [string, ...string[]]),
    code: z.enum([...AcademicSemesterCodes] as [string, ...string[]]),
    year: z.string({
      invalid_type_error: "year must be a string",
      required_error: "year is required",
    }),
    startMonth: z.enum([...Months] as [string, ...string[]]),
    endMonth: z.enum([...Months] as [string, ...string[]]),
  }),
});

// Manually define the schema for updating TAcademicSemester (all fields optional)
const updateAcademicSemesterSchema = z.object({
  body: z.object({
    name: z
      .enum([...AcademicSemesterNames] as [string, ...string[]])
      .optional(),
    code: z
      .enum([...AcademicSemesterCodes] as [string, ...string[]])
      .optional(),
    year: z.string().optional(),
    startMonth: z.enum([...Months] as [string, ...string[]]).optional(),
    endMonth: z.enum([...Months] as [string, ...string[]]).optional(),
  }),
});

export { academicSemesterSchema, updateAcademicSemesterSchema };
