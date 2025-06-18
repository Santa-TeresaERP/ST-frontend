import { z } from 'zod';

export const lostSchema = z.object({
  production_id: z.string().uuid('El ID del producto debe ser un UUID válido'),

  quantity: z
    .number()
    .int('La cantidad debe ser un número entero')
    .positive('La cantidad debe ser mayor que cero'),

  lost_type: z
    .string()
    .min(1, 'El tipo de pérdida no puede estar vacío')
    .max(50, 'El tipo de pérdida no debe exceder los 50 caracteres'),

  observations: z
    .string()
    .max(255, 'Las observaciones no deben exceder los 255 caracteres')
    .optional(), // opcional si lo defines así en la base de datos

});