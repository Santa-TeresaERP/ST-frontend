import { z } from "zod";

export const createIncomeSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  price: z.number().positive(),
  idChurch: z.string().min(1),
  date: z.string().optional(),
});

export const updateIncomeSchema = createIncomeSchema.partial();
