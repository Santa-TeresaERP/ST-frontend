import { z } from 'zod';

export const salesDetailsSchema = z.object({
  salesId: z
    .string()
    .uuid('El ID de la venta debe ser un UUID válido'),
  
  productId: z
    .string()
    .uuid('El ID del producto debe ser un UUID válido'),
  
  quantity: z
    .number({
      required_error: 'La cantidad es obligatoria',
      invalid_type_error: 'La cantidad debe ser un número',
    })
    .int('La cantidad debe ser un número entero')
    .min(1, 'La cantidad debe ser mayor a 0')
    .max(100, 'La cantidad no puede exceder 100'),
  
  mount: z
    .number({
      required_error: 'El monto es obligatorio',
      invalid_type_error: 'El monto debe ser un número',
    })
    .positive('El monto debe ser un número positivo')
    .min(0.01, 'El monto debe ser mayor a 0')
    .max(999999.99, 'El monto no puede exceder 999,999.99'),
});

// Schema derivado para crear detalles de venta (mismo que el principal)
export const createSalesDetailsSchema = salesDetailsSchema;

// Schema derivado para actualizar detalles de venta (campos opcionales)
export const updateSalesDetailsSchema = salesDetailsSchema.partial();