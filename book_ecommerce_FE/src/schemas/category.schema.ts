import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Tên danh mục là bắt buộc").max(255, "Tên danh mục không được quá 255 ký tự"),
  description: z.string(),
  parent_id: z.number().optional(),
  active: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;