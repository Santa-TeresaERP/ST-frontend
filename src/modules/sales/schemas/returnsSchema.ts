import { z } from 'zod'

export const returnSchema = z.object({
  productId: z.string().nonempty('El producto es obligatorio'),
  salesId: z.string().nonempty('La venta es obligatoria'),
  reason: z.string().min(1, 'La razón es obligatoria'),
  observations: z.string().min(1, 'Las observaciones son obligatorias'),
  quantity: z.number().min(1, 'La cantidad debe ser mayor a 0'),
})

export type returnSchemaType = z.infer<typeof returnSchema>
