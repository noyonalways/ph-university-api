import { z } from "zod";

export const loginValidationSchema = z.object({
  body: z
    .object({
      id: z.string({
        invalid_type_error: "id must be a string",
        required_error: "id is required",
      }),
      password: z.string({
        invalid_type_error: "password must be a string",
        required_error: "password is required",
      }),
    })
    .strict(),
});
