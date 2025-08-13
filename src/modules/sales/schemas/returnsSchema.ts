import { z } from 'zod'

export const returnSchema = z.object({
  productId: z.string().uuid('El ID del producto debe ser un UUID válido').min(1, 'El producto es obligatorio'),
  salesId: z.string().uuid('El ID de la venta debe ser un UUID válido').min(1, 'La venta es obligatoria'),
  reason: z.string().min(1, 'La razón es obligatoria'),
  observations: z.string().min(1, 'Las observaciones son obligatorias'),
  quantity: z.number().min(1, 'La cantidad debe ser mayor a 0'),
})

export type returnSchemaType = z.infer<typeof returnSchema>
