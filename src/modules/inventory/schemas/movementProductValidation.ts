import { z } from 'zod';

export const movementProductSchema = z.object({
  warehouse_id: z.string()
    .min(1, 'Debe seleccionar un almacén')
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, 'Debe seleccionar un almacén válido'),
  store_id: z.string()
    .optional()
    .nullable()
    .transform((val) => {
      // Si es string vacío, undefined o null, convertir a null
      if (!val || val.trim() === '') return null;
      return val.trim();
    }),
  product_id: z.string()
    .min(1, 'Debe seleccionar un producto')
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, 'Debe seleccionar un producto válido'),
  movement_type: z.enum(['entrada', 'salida'], {
    errorMap: () => ({
      message: 'El tipo de movimiento debe ser "entrada" o "salida"',
    }),
  }),
  quantity: z.number({
    required_error: 'La cantidad es requerida',
    invalid_type_error: 'La cantidad debe ser un número'
  }).min(0, 'La cantidad debe ser mayor o igual a 0'),
  movement_date: z.string({
    required_error: 'La fecha del movimiento es requerida',
    invalid_type_error: 'La fecha del movimiento debe ser válida',
  }).regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe estar en formato YYYY-MM-DD')
    .transform((dateString) => {
      // Crear fecha sin zona horaria para evitar cambios de día
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    }),
  observations: z.string()
    .max(150, 'Las observaciones no deben exceder los 150 caracteres')
    .optional()
    .transform((val) => {
      // Si es string vacío, convertir a undefined
      if (!val || val.trim() === '') return undefined;
      return val.trim();
    }),
  status: z.boolean().default(true),
});