import { z } from 'zod';

export const BuysResourceValidationSchema = z.object({
  warehouse_id: z.string()
    .min(1, 'Debe seleccionar un almacén')
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, 'Debe seleccionar un almacén válido'),
  resource_id: z.string()
    .min(1, 'Debe seleccionar un recurso')
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, 'Debe seleccionar un recurso válido'),
  quantity: z.number({ 
    required_error: 'La cantidad es requerida',
    invalid_type_error: 'La cantidad debe ser un número' 
  }).min(0.01, 'La cantidad debe ser mayor a 0'),
  type_unit: z.string().min(1, 'Debe seleccionar una unidad'),
  total_cost: z.number({ 
    required_error: 'El costo total es requerido',
    invalid_type_error: 'El costo total debe ser un número' 
  }).min(0.01, 'El costo total debe ser mayor a 0'),
  supplier_id: z.string()
    .min(1, 'Debe seleccionar un proveedor')
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, 'Debe seleccionar un proveedor válido'),
  entry_date: z.string().min(1, 'La fecha de entrada es requerida'),
});

export type BuysResourceFormData = z.infer<typeof BuysResourceValidationSchema>;
