import { z } from 'zod';

/**
 * Schema para el formulario de CREACIÓN de un Gasto de Monasterio.
 */
export const monasteryExpenseFormSchema = z.object({
  category: z.string()
    .min(1, 'La categoría es obligatoria.')
    .max(100, 'La categoría no puede exceder 100 caracteres.'),
  
  amount: z.coerce.number({ invalid_type_error: 'El monto debe ser un número.' })
    .min(0.01, 'El monto debe ser mayor que cero.')
    .max(999999.99, 'El monto no puede exceder 999,999.99'),
  
  Name: z.string()
    .min(1, 'El nombre es obligatorio.')
    .max(200, 'El nombre no puede exceder 200 caracteres.')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-_.,0-9]+$/, { 
      message: 'El nombre solo puede contener letras, números, espacios y algunos símbolos básicos.' 
    }),
  
  date: z.string()
    .min(1, 'La fecha es obligatoria.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe estar en formato YYYY-MM-DD')
    .refine((date) => {
      const parsedDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Permitir fechas de hoy
      return parsedDate <= today;
    }, 'La fecha no puede ser futura.'),
  
  descripción: z.string()
    .min(1, 'La descripción es obligatoria.')
    .max(500, 'La descripción no puede exceder 500 caracteres.'),
  
});

/**
 * Schema para el formulario de EDICIÓN.
 * Hace todos los campos opcionales para permitir actualizaciones parciales.
 */
export const updateMonasteryExpenseFormSchema = monasteryExpenseFormSchema.partial();

/**
 * Schema para filtros de búsqueda de gastos de monasterio.
 */
export const monasteryExpenseFilterSchema = z.object({
  category: z.string().optional(),
  overheadsId: z.string().uuid().optional(),
  startDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe estar en formato YYYY-MM-DD')
    .optional(),
  endDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe estar en formato YYYY-MM-DD')
    .optional(),
  minAmount: z.coerce.number().min(0).optional(),
  maxAmount: z.coerce.number().min(0).optional(),
}).refine((data) => {
  // Validar que la fecha de inicio no sea posterior a la fecha de fin
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, {
  message: 'La fecha de inicio debe ser anterior o igual a la fecha de fin.',
  path: ['startDate'],
}).refine((data) => {
  // Validar que el monto mínimo no sea mayor al máximo
  if (data.minAmount !== undefined && data.maxAmount !== undefined) {
    return data.minAmount <= data.maxAmount;
  }
  return true;
}, {
  message: 'El monto mínimo debe ser menor o igual al monto máximo.',
  path: ['minAmount'],
});

/**
 * Schema para validación de bulk operations (operaciones en lote)
 */
export const bulkMonasteryExpenseSchema = z.object({
  ids: z.array(z.string().uuid('Debe ser un ID válido.'))
    .min(1, 'Debe seleccionar al menos un gasto.')
    .max(100, 'No puede seleccionar más de 100 gastos a la vez.'),
  action: z.enum(['delete', 'updateCategory', 'assignOverhead'], {
    required_error: 'Debe especificar una acción.',
  }),
  // Campos condicionales según la acción
  newCategory: z.string().optional(),
  newOverheadsId: z.string().uuid().optional(),
});

// Tipos inferidos para usar con react-hook-form
export type MonasteryExpenseFormData = z.infer<typeof monasteryExpenseFormSchema>;
export type UpdateMonasteryExpenseFormData = z.infer<typeof updateMonasteryExpenseFormSchema>;
export type MonasteryExpenseFilterData = z.infer<typeof monasteryExpenseFilterSchema>;
export type BulkMonasteryExpenseData = z.infer<typeof bulkMonasteryExpenseSchema>;

// Schema personalizado para categorías predefinidas (puedes ajustar según tus necesidades)
export const MONASTERY_EXPENSE_CATEGORIES = [
  'Alimentos',
  'Servicios Públicos',
  'Mantenimiento',
  'Material Religioso',
  'Transporte',
  'Medicina',
  'Educación',
  'Donaciones',
  'Otros',
] as const;

export const categorySchema = z.enum(MONASTERY_EXPENSE_CATEGORIES, {
  required_error: 'Debe seleccionar una categoría válida.',
});