import { z } from "zod";

export const bookFormSchema = z.object({
  title: z.string().min(1, "Tiêu đề sách là bắt buộc").max(255, "Tiêu đề không được quá 255 ký tự"),
  description: z.string().min(1, "Mô tả là bắt buộc").max(5000, "Mô tả không được quá 5000 ký tự"),
  price: z.string().min(1, "Giá là bắt buộc"),
  discount_percentage: z.string().optional(),
  stock_quantity: z.string().min(1, "Số lượng kho là bắt buộc"),
  cover_image: z.any().optional(),
  sample_pages: z.any().optional(),
  author_ids: z.string().optional(),
  category_ids: z.string().optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  sold_count: z.string().optional(),
  cost_price: z.string().optional(),
});

export type BookFormValues = z.infer<typeof bookFormSchema>;