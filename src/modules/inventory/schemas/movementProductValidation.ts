import { z } from 'zod';

export const movementProductSchema = z.object({

  store_id: z.string().uuid().optional().nullable(),
  product_id: z.string().uuid({
    message: 'El ID del producto debe ser un UUID válido',
  }),

  movement_type: z.enum(['salida', 'entrada'], {
    errorMap: () => ({
      message: 'El tipo de movimiento debe ser "salida" o "entrada"',
    }),
  }),
  quantity: z.number().nonnegative('La cantidad no puede ser negativa'),
  movement_date: z.coerce.date({
    invalid_type_error: 'La fecha del movimiento debe ser válida',
  }),
  observations: z.string().max(150, 'Las observaciones no deben exceder los 150 caracteres').optional(),
});