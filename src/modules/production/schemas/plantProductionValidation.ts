import { z } from 'zod';

export const plantProductionSchema = z.object({
  plant_name: z
    .string()
    .min(1, 'El nombre de la planta no puede estar vacío')
    .max(100, 'El nombre de la planta no debe exceder los 100 caracteres'),

  address: z
    .string()
    .min(1, 'La dirección no puede estar vacía')
    .max(255, 'La dirección no debe exceder los 255 caracteres'),
});