import { z } from 'zod';

export const movementProductSchema = z.object({

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