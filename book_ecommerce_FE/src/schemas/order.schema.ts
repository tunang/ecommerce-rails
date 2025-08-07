import { z } from "zod";

export const orderUpdateSchema = z.object({
  status: z.number().min(0).max(6),
});

export type OrderUpdateFormValues = z.infer<typeof orderUpdateSchema>;