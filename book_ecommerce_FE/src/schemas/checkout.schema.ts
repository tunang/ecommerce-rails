import { z } from "zod";

export const checkoutSchema = z.object({
  address_id: z.number().min(1, "Vui lòng chọn địa chỉ giao hàng"),
  payment_method: z.string().min(1, "Vui lòng chọn phương thức thanh toán"),
  note: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;