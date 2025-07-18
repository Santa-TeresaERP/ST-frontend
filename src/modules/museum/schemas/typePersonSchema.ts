import { z } from 'zod';

export const typePersonSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  base_price: z.number().min(0, 'El precio base debe ser mayor o igual a 0'),
}); 