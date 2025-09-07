import { z } from 'zod'

export const returnSchema = z.object({
  productId: z.string().uuid('El ID del producto debe ser un UUID válido'),
  salesId: z.string().uuid('El ID de la venta debe ser un UUID válido').optional().nullable(),
  storeId: z.string().uuid('El ID de la tienda debe ser un UUID válido').optional().nullable(),
  reason: z.string().min(1, 'La razón es obligatoria'),
  observations: z.string().optional(),
  quantity: z.number().min(1, 'La cantidad debe ser mayor a 0'),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
})

export type returnSchemaType = z.infer<typeof returnSchema>
