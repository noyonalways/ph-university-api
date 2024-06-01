import { z } from "zod";

const academicFacultySchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: "Academic faculty must be string",
        required_error: "Academic faculty name is required",
      })
      .min(3, "academic faculty name must be at least 3 characters"),
  }),
});

export default academicFacultySchema;
