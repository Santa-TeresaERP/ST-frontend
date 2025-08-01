import { z } from 'zod';

export const RentalSchema = z.object({
  id: z.string(),
  customer_id: z.string(),
  place_id: z.string(),
  user_id: z.string(),
  start_date: z.date(),
  end_date: z.date(),
  amount: z.number().positive(),
});

export type Rental = z.infer<typeof RentalSchema>;

export interface CreateRentalPayload {
  customer_id: string;
  place_id: string;
  user_id: string;
  start_date: Date;
  end_date: Date;
  amount: number;
}

export interface UpdateRentalPayload {
  customer_id?: string;
  place_id?: string;
  user_id?: string;
  start_date?: Date;
  end_date?: Date;
  amount?: number;
}
