import { z } from 'zod';

export const BuysResourceValidationSchema = z.object({
  warehouse_id: z.string().min(1, 'Debe seleccionar un almacén'),
  resource_id: z.string().min(1, 'Debe seleccionar un recurso'),
  quantity: z.number({ invalid_type_error: 'La cantidad debe ser un número' }).min(0.01, 'La cantidad debe ser mayor a 0'),
  type_unit: z.string().min(1, 'Debe seleccionar una unidad'),
  unit_price: z.number({ invalid_type_error: 'El precio unitario debe ser un número' }).min(0.01, 'El precio unitario debe ser mayor a 0'),
  total_cost: z.number({ invalid_type_error: 'El costo total debe ser un número' }).min(0.01, 'El costo total debe ser mayor a 0'),
  supplier_id: z.string().min(1, 'Debe seleccionar un proveedor'),
  entry_date: z.string().min(1, 'La fecha de entrada es requerida'),
});

// Esquema para edición con campos inmutables opcionales
export const BuysResourceEditValidationSchema = z.object({
  warehouse_id: z.string().optional(),
  resource_id: z.string().optional(),
  quantity: z.number({ invalid_type_error: 'La cantidad debe ser un número' }).min(0.01, 'La cantidad debe ser mayor a 0'),
  type_unit: z.string().min(1, 'Debe seleccionar una unidad'),
  unit_price: z.number().optional(),
  total_cost: z.number().optional(),
  supplier_id: z.string().min(1, 'Debe seleccionar un proveedor'),
  entry_date: z.string().min(1, 'La fecha de entrada es requerida'),
});

export type BuysResourceFormData = z.infer<typeof BuysResourceValidationSchema>;
export type BuysResourceEditFormData = z.infer<typeof BuysResourceEditValidationSchema>;
