import { z } from 'zod';

export const saleSchema = z.object({
  income_date: z
    .string()
    .nonempty('La fecha de ingreso no puede estar vacía')
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'La fecha debe estar en formato YYYY-MM-DD'
    ),
  store_id: z
    .string()
    .uuid('El ID de la tienda debe ser un UUID válido'),
  total_income: z
    .number()
    .positive('El ingreso total debe ser un número positivo')
    .min(0.01, 'El ingreso total debe ser mayor a 0'),
  observations: z
    .string()
    .max(500, 'Las observaciones no deben exceder los 500 caracteres')
    .optional()
    .refine((val) => {
      if (val && /<script|<\/script|SELECT|DROP|INSERT|--/i.test(val)) {
        return false;
      }
      return true;
    }, 'Las observaciones contienen caracteres no permitidos o posibles inyecciones'),
});

// Schema derivado para crear ventas (mismo que el principal)
export const createSaleSchema = saleSchema;

// Schema derivado para actualizar ventas (campos opcionales)
export const updateSaleSchema = saleSchema.partial();