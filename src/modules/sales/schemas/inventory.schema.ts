import { z } from 'zod';

// Esquema para el formulario de CREACIÓN (con los 3 campos)
export const createWarehouseStoreSchema = z.object({
  productId: z.string().min(1, 'Es obligatorio seleccionar un producto.'),
  storeId: z.string().min(1, 'Es obligatorio seleccionar una tienda.'),
  quantity: z.coerce.number().min(0, 'La cantidad no puede ser negativa.'),
});

// Esquema para el formulario de EDICIÓN (con los 3 campos)
export const updateWarehouseStoreSchema = z.object({
  productId: z.string().min(1, 'Es obligatorio seleccionar un producto.'),
  storeId: z.string().min(1, 'Es obligatorio seleccionar una tienda.'),
  quantity: z.coerce.number().min(0, 'La cantidad no puede ser negativa.'),
});

export type CreateWarehouseStoreFormData = z.infer<typeof createWarehouseStoreSchema>;
export type UpdateWarehouseStoreFormData = z.infer<typeof updateWarehouseStoreSchema>;