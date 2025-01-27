import { z } from 'zod';

export const userSchema = z.object({
  name: z
    .string()
    .max(45, 'El nombre completo no debe exceder los 45 caracteres')
    .regex(
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
      'El nombre solo debe contener letras y espacios',
    ),
  dni: z
    .string()
    .length(8, 'El DNI debe tener 8 dígitos')
    .regex(/^[0-9]+$/, 'El DNI solo debe contener números'),
  phonenumber: z
    .string()
    .length(9, 'El número telefónico debe tener 9 dígitos')
    .regex(/^[0-9]+$/, 'El número telefónico solo debe contener números'),
  email: z.string().email('El email debe tener un formato válido'),
  roleId: z.string().nonempty('El rol no puede estar vacío'),
  password: z
    .string()
    .min(5, 'La contraseña debe tener al menos 5 caracteres')
    .regex(
      /^(?=.*[a-zñ])(?=.*[A-ZÑ])(?=.*\d)[A-Za-zñÑ\d_-]+$/,
      'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y solo los caracteres "_" o "-" permitidos',
    ),
  status: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});