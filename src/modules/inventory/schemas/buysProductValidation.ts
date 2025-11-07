import { z } from 'zod';

export const BuysProductValidation = z.object({
  warehouse_id: z.string().uuid('El ID del almacén debe ser un UUID válido').min(1, 'El almacén es obligatorio'),
  product_id: z.string().uuid('El ID del producto debe ser un UUID válido').min(1, 'El producto es obligatorio'),
  supplier_id: z.string().uuid('El ID del proveedor debe ser un UUID válido').min(1, 'El proveedor es obligatorio'),
  quantity: z.number().positive('La cantidad debe ser mayor a 0'),
  unit_price: z.number().positive('El precio unitario debe ser mayor a 0'),
  total_cost: z.number().positive('El costo total debe ser mayor a 0'),
  entry_date: z.string().min(1, 'La fecha de entrada es obligatoria'),
  status: z.boolean().optional().default(true),
});

export type BuysProductValidationType = z.infer<typeof BuysProductValidation>;
