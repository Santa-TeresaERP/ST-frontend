import { z } from 'zod';

export const supplierSchema = z.object({
  RUC: z.number().int('El RUC debe ser un número').optional(),
  supplier_name: z.string().min(1, 'El nombre es obligatorio').max(100, 'Máximo 100 caracteres'),
  contact_name: z.string().min(1, 'El contacto es obligatorio').max(100, 'Máximo 100 caracteres'),
  email: z.string().email('Debe ser un email válido'),
  phone: z.number().int('El teléfono debe ser un número'),
  adress: z.string().min(1, 'La dirección es obligatoria').max(255, 'Máximo 255 caracteres'),
});
