import { z } from 'zod';

export const roleSchema = z.object({
  name: z
    .string()
    .max(45, 'El nombre del rol no debe exceder los 45 caracteres')
    .regex(
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
      'El nombre del rol solo debe contener letras y espacios',
    ),
  description: z
    .string()
    .max(255, 'La descripción del rol no debe exceder los 255 caracteres')
    .optional(),
});