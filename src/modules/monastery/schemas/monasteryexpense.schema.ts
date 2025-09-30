import { z } from 'zod';

/**
 * Schema para el formulario de CREACIÓN de un Gasto del Monasterio.
 */
export const monasteryExpenseFormSchema = z.object({
  category: z.string()
    .min(1, 'La categoría es obligatoria.')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'La categoría solo puede contener letras.' }),
  
  amount: z.coerce.number({ invalid_type_error: 'El monto debe ser un número.' })
    .min(0.01, 'El monto debe ser mayor que cero.'),
    
  Name: z.string()
    .min(1, 'El nombre es obligatorio.')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/, { message: 'El nombre solo puede contener letras, números y espacios.' }),
  
  date: z.string().min(1, 'La fecha es obligatoria.'),
  
  descripción: z.string()
    .min(1, 'La descripción es obligatoria.'),
});

/**
 * Schema para el formulario de EDICIÓN.
 * Hace todo opcional para permitir actualizaciones parciales.
 */
export const updateMonasteryExpenseFormSchema = monasteryExpenseFormSchema.partial();

// Tipos inferidos para usar con react-hook-form
export type MonasteryExpenseFormData = z.infer<typeof monasteryExpenseFormSchema>;
export type UpdateMonasteryExpenseFormData = z.infer<typeof updateMonasteryExpenseFormSchema>;