import { z } from 'zod';

/**
 * Schema para el formulario de CREACIÓN de un gasto.
 */
export const expenseFormSchema = z.object({
  module_id: z.string().uuid({ message: "Debe seleccionar un módulo válido." }),
  expense_type: z.string()
    .min(1, 'El tipo de gasto es obligatorio.')
    .max(100, 'El tipo no debe exceder los 100 caracteres.'),
  // Usamos z.coerce.number() para manejar la entrada de formularios
  amount: z.coerce.number({ invalid_type_error: 'El monto debe ser un número.' })
    .positive('El monto debe ser mayor que cero.'),
  date: z.string().min(1, { message: 'La fecha es obligatoria.' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe estar en formato YYYY-MM-DD'),
  description: z.string().max(500, 'La descripción no puede exceder los 500 caracteres.').optional(),
});

/**
 * Schema para el formulario de EDICIÓN de un gasto.
 */
export const updateExpenseFormSchema = expenseFormSchema.partial();

// Tipos inferidos para usar con react-hook-form
export type ExpenseFormData = z.infer<typeof expenseFormSchema>;
export type UpdateExpenseFormData = z.infer<typeof updateExpenseFormSchema>