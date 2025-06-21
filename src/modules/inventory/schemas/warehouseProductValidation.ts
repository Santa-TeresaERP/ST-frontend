import { z } from 'zod';

export const warehouseProductValidationSchema = z.object({
  warehouse_id: z.string().uuid().min(1, 'El ID del almacén es requerido'),
  product_id: z.string().uuid().min(1, 'El ID del producto es requerido'),
  quantity: z.number().min(0, 'La cantidad debe ser mayor o igual a 0'),
  entry_date: z.string().min(1, 'La fecha de entrada es requerida'),
});

export const warehouseProductValidation = (data: unknown) => {
  return warehouseProductValidationSchema.safeParse(data);
};