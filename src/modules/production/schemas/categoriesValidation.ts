import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre no puede estar vacío')
    .max(100, 'El nombre no debe exceder los 100 caracteres'),

  description: z
    .string()
    .max(255, 'La descripción no debe exceder los 255 caracteres'),
});