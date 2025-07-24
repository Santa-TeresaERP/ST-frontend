import { z } from 'zod';

export const paymentMethodSchema = z.object({
  name: z.string().min(1, 'El nombre del método de pago es obligatorio'),
});
