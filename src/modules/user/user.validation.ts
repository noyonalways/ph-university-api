import { z } from "zod";
import { UserStatus } from "./user.constant";

export const userSchema = z.object({
  password: z
    .string({
      invalid_type_error: "password must be string",
    })
    .max(20, { message: "password can not be more than 20 characters" })
    .optional(),
});

export const changeStatusValidationSchema = z.object({
  body: z
    .object({
      status: z.enum([...UserStatus] as [string, ...string[]], {
        required_error: "status is required",
        invalid_type_error: "status must be string",
      }),
    })
    .strict(),
});
