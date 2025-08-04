import { z } from 'zod';

export const locationSchema = z.object({
  name: z
    .string()
    .max(45, 'El nombre no debe exceder los 45 caracteres')
    .regex(
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$/,
      'El nombre solo debe contener letras, números y espacios',
    ),
  address: z
    .string()
    .max(255, 'La dirección no debe exceder los 255 caracteres'),
  capacity: z
    .number()
    .min(1, 'La capacidad debe ser mayor a 0'),
  status: z
    .string()
    .max(20, 'El estado no debe exceder los 20 caracteres'),
});
