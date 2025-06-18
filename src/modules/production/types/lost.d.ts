import { z } from 'zod';

export const LostSchema = z.object({
  id: z.string(),
  production_id: z.string(),
  quantity: z.number().positive(),
  lost_type: z.string(),
  observations: z.string(),
  created_at: z.date(),
});

export type Lost = z.infer<typeof LostSchema>;

export interface CreateLostPayload {
  production_id: string;
  quantity: number;
  lost_type: string;
  observations: string;
}

export interface UpdateLostPayload {
  production_id?: string;
  quantity?: number;
  lost_type?: string;
  observations?: string;
}