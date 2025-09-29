import { z } from 'zod';
import { OverheadAttributes } from '../types/overheads';

export const createOverheadSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'El nombre es obligatorio' })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/, {
      message: 'El nombre solo puede contener letras, números y espacios',
    }),
  date: z.string({
    required_error: 'La fecha es obligatoria',
    invalid_type_error: 'La fecha debe ser una fecha válida',
  }),
  type: z.enum(
    ['monasterio', 'donativo', 'gasto mensual', 'otro ingreso', 'otro egreso'],
    {
      required_error: 'El tipo es obligatorio',
      invalid_type_error:
        'El tipo debe ser: monasterio, donativo, gasto mensual, otro ingreso, o otro egreso',
    },
  ),
  amount: z
    .number({
      required_error: 'El monto es obligatorio',
      invalid_type_error: 'El monto debe ser un número válido',
    })
    .min(0, { message: 'El monto debe ser positivo' }),
  description: z.string().optional(),
});

export const updateOverheadSchema = createOverheadSchema.omit({ type: true });

export const overheadValidation = (data: OverheadAttributes) => {
  return createOverheadSchema.safeParse(data);
};

export const overheadUpdateValidation = (data: Partial<OverheadAttributes>) => {
  return updateOverheadSchema.partial().safeParse(data);
};