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
  movement_date: z.union([z.string(), z.date()]),
  observations: z.string().max(150, 'Las observaciones no deben exceder los 150 caracteres').optional().nullable(),
});