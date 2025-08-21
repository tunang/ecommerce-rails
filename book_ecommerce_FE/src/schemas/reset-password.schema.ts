import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Email không hợp lệ",
  }),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Mật khẩu phải có ít nhất 6 ký tự",
  }),
  password_confirmation: z.string().min(6, {
    message: "Xác nhận mật khẩu phải có ít nhất 6 ký tự",
  }),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["password_confirmation"],
});