// Verified Zod import path
import { z } from 'zod';

// Validation schema for the resource creation/update form
// Aligned with CreateResourcePayload and UpdateResourcePayload in types/resource.ts
export const ResourceValidationSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'El nombre del recurso es obligatorio.' })
    .max(100, { message: 'El nombre del recurso no debe exceder los 100 caracteres.' }), // Consistent max length assumption
  unit_price: z
    .string() // Keep as string to match input and backend model type
    .min(1, { message: 'El precio unitario es obligatorio.' })
    // Regex allows numbers and optionally a decimal part with 1 or 2 digits
    .regex(/^\d+(\.\d{1,2})?$/, { message: 'Ingrese un precio válido (ej: 10 o 10.99).' }), 
  type_unit: z
    .string()
    .min(1, { message: 'El tipo de unidad es obligatorio.' })
    .max(50, { message: 'El tipo de unidad no debe exceder los 50 caracteres.' }), // Consistent max length assumption
  total_cost: z
    .number({ invalid_type_error: 'El costo total debe ser un número.' })
    .positive({ message: 'El costo total debe ser un número positivo.' }),
  supplier_id: z
    .string()
    .uuid({ message: 'Seleccione un proveedor válido (UUID).' })
    .optional()
    .nullable(), // Allow empty selection, consistent with type
  observation: z
    .string()
    .max(255, { message: 'La observación no debe exceder los 255 caracteres.' })
    .optional()
    .nullable(), // Consistent with type
  purchase_date: z
    .string()
    .min(1, { message: 'La fecha de compra es obligatoria.' })
    // Basic check for YYYY-MM-DD format expected by input type='date'
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Ingrese una fecha válida (YYYY-MM-DD).' })
    // Optionally refine further to check if it's a valid date
    // .refine((date) => !isNaN(Date.parse(date)), { message: 'Fecha inválida' })
});

// Note: This single schema is used for both create and edit.
// If update rules differ (e.g., some fields become optional),
// you might create a separate UpdateResourceValidationSchema, potentially using .partial()
// Example: export const UpdateResourceValidationSchema = ResourceValidationSchema.partial();

