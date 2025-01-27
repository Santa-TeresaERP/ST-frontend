import { z } from 'zod';

export const moduleSchema = z.object({
  name: z
    .string()
    .max(45, 'El nombre del módulo no debe exceder los 45 caracteres')
    .regex(
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
      'El nombre del módulo solo debe contener letras y espacios',
    ),
  description: z
    .string()
    .max(255, 'La descripción del módulo no debe exceder los 255 caracteres')
    .optional(),
});