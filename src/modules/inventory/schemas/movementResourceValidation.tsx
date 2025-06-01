import { z } from 'zod';

export const warehouseMovementResourceSchema = z.object({
  movement_id: z.string().uuid('El ID del movimiento debe ser un UUID válido').nonempty('El ID del movimiento no puede estar vacío'),
  warehouse_id: z.string().uuid('El ID del almacén debe ser un UUID válido').nonempty('El ID del almacén no puede estar vacío'),
  resource_id: z.string().uuid('El ID del recurso debe ser un UUID válido').nonempty('El ID del recurso no puede estar vacío'),
  type: z.string().min(1, 'El tipo de movimiento es obligatorio').max(50, 'El tipo de movimiento no debe exceder los 50 caracteres'),
  movement_type: z.string().min(1, 'El tipo de movimiento es obligatorio').max(50, 'El tipo de movimiento no debe exceder los 50 caracteres'),
  quantity: z.number({ invalid_type_error: 'La cantidad debe ser un número' }).nonnegative('La cantidad no puede ser negativa'),
  movement_date: z.coerce.date({ invalid_type_error: 'La fecha del movimiento debe ser válida' }),
  observations: z.string().max(150, 'Las observaciones no deben exceder los 150 caracteres').optional(),
  createdAt: z.date({ invalid_type_error: 'La fecha de creación debe ser una fecha válida' }).optional(),
  updatedAt: z.date({ invalid_type_error: 'La fecha de actualización debe ser una fecha válida' }).optional(),
});

export const warehouseMovementResourceValidation = (data: any) =>
  warehouseMovementResourceSchema.safeParse(data);