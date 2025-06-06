// Verified Zod import path
import { z } from 'zod';

// Validation schema for the resource creation/update form
// Aligned with CreateResourcePayload and UpdateResourcePayload in types/resource.ts
export const ResourceValidationSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  unit_price: z.string().min(1, 'El precio unitario es requerido'),
  type_unit: z.string().min(1, 'La unidad es requerida'),
  total_cost: z.number().min(0, 'El costo total debe ser mayor o igual a 0'),
  supplier_id: z.string().nullable(),
  observation: z.string().nullable(),
  purchase_date: z.string().min(1, 'La fecha de compra es requerida'),
});

// Note: This single schema is used for both create and edit.
// If update rules differ (e.g., some fields become optional),
// you might create a separate UpdateResourceValidationSchema, potentially using .partial()
// Example: export const UpdateResourceValidationSchema = ResourceValidationSchema.partial();

