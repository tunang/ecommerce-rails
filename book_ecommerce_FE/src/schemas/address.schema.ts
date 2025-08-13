import { z } from "zod";

export const addressSchema = z.object({
  first_name: z.string().min(1, "Tên không được để trống"),
  last_name: z.string().min(1, "Họ không được để trống"),
  address_line_1: z.string().min(1, "Địa chỉ dòng 1 không được để trống"),
  address_line_2: z.string().optional(),
  city: z.string().min(1, "Thành phố không được để trống"),
  state: z.string().min(1, "Tỉnh/bang không được để trống"),
  postal_code: z.string().min(1, "Mã bưu điện không được để trống"),
  country: z.string().min(1, "Quốc gia không được để trống"),
  phone: z.string().min(1, "Số điện thoại không được để trống").regex(/^[0-9+\-\s()]+$/, "Số điện thoại không hợp lệ"),
  is_default: z.boolean().default(false),
});

export type AddressFormData = z.infer<typeof addressSchema>;