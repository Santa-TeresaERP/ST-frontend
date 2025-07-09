import { z } from 'zod';

export const BuysResourceValidationSchema = z.object({
  warehouse_id: z.string().min(1, 'Debe seleccionar un almacén'),
  resource_id: z.string().min(1, 'Debe seleccionar un recurso'),
  quantity: z.number({ invalid_type_error: 'La cantidad debe ser un número' }).min(0.01, 'La cantidad debe ser mayor a 0'),
  type_unit: z.string().min(1, 'Debe seleccionar una unidad'),
  total_cost: z.number({ invalid_type_error: 'El costo total debe ser un número' }).min(0.01, 'El costo total debe ser mayor a 0'),
  supplier_id: z.string().min(1, 'Debe seleccionar un proveedor'),
  entry_date: z.string().min(1, 'La fecha de entrada es requerida'),
});

export type BuysResourceFormData = z.infer<typeof BuysResourceValidationSchema>;
