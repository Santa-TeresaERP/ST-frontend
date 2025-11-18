import { z } from 'zod'

export const churchSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no debe exceder los 100 caracteres'),
  location: z
    .string()
    .min(1, 'La ubicación es requerida')
    .max(150, 'La ubicación no debe exceder los 150 caracteres'),
  state: z.boolean().optional().default(true),
  status: z.boolean().optional().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export const churchValidation = (data: unknown) => churchSchema.safeParse(data)
export const churchValidationPartial = (data: unknown) => churchSchema.partial().safeParse(data)

export default churchSchema
