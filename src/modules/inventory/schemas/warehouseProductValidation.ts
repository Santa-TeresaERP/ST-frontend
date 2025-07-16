import { z } from 'zod';

export const warehouseProductValidationSchema = z.object({
  warehouse_id: z.string()
    .min(1, 'Debe seleccionar un almacén')
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, 'Debe seleccionar un almacén válido'),
  product_id: z.string()
    .min(1, 'Debe seleccionar un producto')
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, 'Debe seleccionar un producto válido'),
  quantity: z.number({
    required_error: 'La cantidad es requerida',
    invalid_type_error: 'La cantidad debe ser un número'
  }).min(0, 'La cantidad debe ser mayor o igual a 0'),
  entry_date: z.string().min(1, 'La fecha de entrada es requerida'),
});

export const warehouseProductValidation = (data: unknown) => {
  return warehouseProductValidationSchema.safeParse(data);
};