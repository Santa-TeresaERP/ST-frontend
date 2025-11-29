// src/modules/inventory/schemas/buysProduct.schema.ts

import { z } from 'zod';

/**
 * Schema ACTUALIZADO para la creación de una compra de producto.
 * Coincide con el nuevo diseño del formulario.
 */
export const createBuysProductSchema = z.object({
  warehouse_id: z.string().min(1, 'Debe seleccionar un almacén.'),
  product_purchased_id: z.string().min(1, 'Debe seleccionar un producto comprado.'),
  supplier_id: z.string().min(1, 'Debe seleccionar un proveedor.'),
  
  quantity: z.coerce.number({ invalid_type_error: 'La cantidad debe ser un número.' })
    .min(1, 'La cantidad debe ser al menos 1.'),
  
  unit_price: z.coerce.number({ invalid_type_error: 'El precio debe ser un número.' })
    .min(0.01, 'El precio debe ser mayor a 0.'),
  
  entry_date: z.string().min(1, 'La fecha de compra es obligatoria.'),

});

/**
 * Schema para la actualización.
 * A diferencia del de creación, no incluye 'name' y 'category' pero sí 'status'
 * y los IDs de almacén y producto.
 */
export const updateBuysProductSchema = z.object({
  warehouse_id: z.string().min(1, 'Debe seleccionar un almacén.'),
  product_id: z.string().min(1, 'Debe seleccionar un producto.'),
  supplier_id: z.string().min(1, 'Debe seleccionar un proveedor.'),
  quantity: z.coerce.number({ invalid_type_error: 'La cantidad debe ser un número.' })
    .min(0, 'La cantidad no puede ser negativa.'),
  unit_price: z.coerce.number({ invalid_type_error: 'El precio debe ser un número.' })
    .min(0, 'El precio no puede ser negativo.'),
  entry_date: z.string().min(1, 'La fecha de entrada es obligatoria.'),
  status: z.boolean(),
});
// ==========================================================

// Tipos inferidos
export type CreateBuysProductFormData = z.infer<typeof createBuysProductSchema>;
export type UpdateBuysProductFormData = z.infer<typeof updateBuysProductSchema>; // <-- Y su tipo inferido
