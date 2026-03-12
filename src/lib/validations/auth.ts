import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("validation.emailInvalid"),
  password: z.string().min(6, "validation.passwordMin"),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, "validation.nameMin"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "validation.passwordMismatch",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
