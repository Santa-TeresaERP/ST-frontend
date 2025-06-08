import { z } from 'zod';

export const LostSchema = z.object({
  id: z.string(),
  product_id: z.string(),
  quantity: z.number().positive(),
  lost_type: z.string(),
  observations: z.string(),
  created_at: z.date(),
});

export type Lost = z.infer<typeof LostSchema>;

export interface CreateLostPayload {
  product_id: string;
  quantity: number;
  lost_type: string;
  observations: string;
}

export interface UpdateLostPayload {
  product_id?: string;
  quantity?: number;
  lost_type?: string;
  observations?: string;
}