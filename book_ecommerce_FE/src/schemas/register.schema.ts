import { z } from "zod";

export const registerSchema = z.object({
    name: z.string()
      .min(2, {
        message: "Tên phải có ít nhất 2 ký tự",
      })
      .max(50, {
        message: "Tên không được quá 50 ký tự",
      }),
    email: z.string().email({
      message: "Email không hợp lệ",
    }),
    password: z.string()
      .min(6, {
        message: "Mật khẩu phải có ít nhất 6 ký tự",
      })
      .max(100, {
        message: "Mật khẩu không được quá 100 ký tự",
      }),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });