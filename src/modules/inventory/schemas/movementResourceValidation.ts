import { z } from 'zod';

export const warehouseMovementResourceSchema = z.object({
  warehouse_id: z.string().min(1, 'Debe seleccionar un almacén'),
  resource_id: z.string().min(1, 'Debe seleccionar un recurso'),
  movement_type: z.enum(['salida', 'entrada'], {
    errorMap: () => ({
      message: 'El tipo de movimiento debe ser "salida" o "entrada"',
    }),
  }),
  quantity: z.number({ invalid_type_error: 'La cantidad debe ser un número' }).positive('La cantidad debe ser mayor que 0'),
  movement_date: z.string({
    required_error: 'La fecha del movimiento es requerida',
    invalid_type_error: 'La fecha del movimiento debe ser válida',
  }).regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe estar en formato YYYY-MM-DD')
    .transform((dateString) => {
      // Crear fecha sin zona horaria para evitar cambios de día
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    }),
  observations: z.string().max(150, 'Las observaciones no deben exceder los 150 caracteres').optional().nullable(),
  status: z.boolean().default(true),
});