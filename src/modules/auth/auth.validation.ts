import { z } from "zod";

export const loginValidationSchema = z.object({
  body: z
    .object({
      id: z.string({
        invalid_type_error: "id must be a string",
        required_error: "id is required",
      }),
      password: z
        .string({
          invalid_type_error: "password must be a string",
          required_error: "password is required",
        })
        .min(8, "password must be at least 8 characters"),
    })
    .strict(),
});

export const changePasswordValidationSchema = z.object({
  body: z
    .object({
      oldPassword: z
        .string({
          invalid_type_error: "old password must be a string",
          required_error: "old password is required",
        })
        .min(8, "old password must be at least 8 characters"),
      newPassword: z
        .string({
          invalid_type_error: "new password must be a string",
          required_error: "new password is required",
        })
        .min(8, "new password must be at least 8 characters"),
    })
    .strict(),
});

export const refreshTokenValidationSchema = z.object({
  cookies: z
    .object({
      refreshToken: z.string({
        invalid_type_error: "refreshToken must be a string",
        required_error: "refreshToken is required",
      }),
    })
    .strict(),
});
