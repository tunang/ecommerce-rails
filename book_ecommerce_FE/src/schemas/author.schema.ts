import { z } from "zod";

export const authorFormSchema = z.object({
  name: z.string().min(1, "Tên tác giả là bắt buộc").max(255, "Tên tác giả không được quá 255 ký tự"),
  biography: z.string().min(1, "Tiểu sử là bắt buộc").max(5000, "Tiểu sử không được quá 5000 ký tự"),
  nationality: z.string().min(1, "Quốc tịch là bắt buộc").max(100, "Quốc tịch không được quá 100 ký tự"),
  photo: z.any().optional(), // File object or string (URL)
  birth_date: z.string().min(1, "Ngày sinh là bắt buộc"),
});

export type AuthorFormValues = z.infer<typeof authorFormSchema>;