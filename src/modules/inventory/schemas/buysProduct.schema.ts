import { z } from 'zod';

/**
 * Schema para la creación de una compra de producto.
 */
export const createBuysProductSchema = z.object({
  warehouse_id: z.string().min(1, 'Debe seleccionar un almacén.'),
  product_id: z.string().min(1, 'Debe seleccionar un producto.'),
  supplier_id: z.string().min(1, 'Debe seleccionar un proveedor.'),
  
  quantity: z.coerce.number({ invalid_type_error: 'La cantidad debe ser un número.' })
    .min(0.01, 'La cantidad debe ser mayor a 0.'),
  
  unit_price: z.coerce.number({ invalid_type_error: 'El precio debe ser un número.' })
    .min(0.01, 'El precio debe ser mayor a 0.'),
  
  entry_date: z.string().min(1, 'La fecha de entrada es obligatoria.'),
});

/**
 * Schema para la actualización. Incluye el campo 'status'.
 */
export const updateBuysProductSchema = createBuysProductSchema.extend({
  status: z.boolean(),
});

// Tipos inferidos para usar con react-hook-form
export type CreateBuysProductFormData = z.infer<typeof createBuysProductSchema>;
export type UpdateBuysProductFormData = z.infer<typeof updateBuysProductSchema>;