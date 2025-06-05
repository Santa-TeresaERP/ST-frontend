import { z } from 'zod';

export const warehouseResourceSchema = z.object({
  warehouse_id: z
    .string()
    .uuid('El ID del almacén debe ser un UUID válido')
    .nonempty('El ID del almacén no puede estar vacío'),

  resource_id: z
    .string()
    .uuid('El ID del recurso debe ser un UUID válido')
    .nonempty('El ID del recurso no puede estar vacío'),

  quantity: z.number({ invalid_type_error: 'La cantidad debe ser un número' }),

  entry_date: z.coerce.date({
    invalid_type_error: 'La fecha de entrada debe ser válida',
  }),
});

export const validateWarehouseResource = (data: unknown) => {
  return warehouseResourceSchema.safeParse(data);
};