import { z } from 'zod';

/**
 * Schema para el formulario de CREACIÓN de un ingreso.
 */
export const incomeFormSchema = z.object({
  module_id: z.string().uuid({ message: "Debe seleccionar un módulo válido." }),
  income_type: z.string()
    .min(1, 'El tipo de ingreso es obligatorio.')
    .max(100, 'El tipo no debe exceder los 100 caracteres.'),
  // Usamos z.coerce.number() para convertir la entrada del formulario (string) a un número
  amount: z.coerce.number({ invalid_type_error: 'El monto debe ser un número.' })
    .positive('El monto debe ser mayor que cero.'),
  date: z.string().min(1, { message: 'La fecha es obligatoria.' }),
  description: z.string().max(500, 'La descripción no puede exceder los 500 caracteres.').optional(),
});

/**
 * Schema para el formulario de EDICIÓN de un ingreso.
 * Es idéntico al de creación, pero todos los campos son opcionales.
 */
export const updateIncomeFormSchema = incomeFormSchema.partial();

// Tipos inferidos para usar con react-hook-form
export type IncomeFormData = z.infer<typeof incomeFormSchema>;
export type UpdateIncomeFormData = z.infer<typeof updateIncomeFormSchema>;