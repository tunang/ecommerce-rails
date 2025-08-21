import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email({
      message: "Email không hợp lệ",
    }),
    password: z.string().min(1, {
      message: "Mật khẩu không được để trống",
    }),
  });