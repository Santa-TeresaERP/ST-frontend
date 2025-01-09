import { z } from 'zod'

export const LoginSchema = z.object({
  email: z
    .string({ message: 'Ingrese un email' })
    .email({ message: 'Ingrese un email valido' }),
  password: z
    .string({ message: 'Ingrese una contraseña' })
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
})

export type LoginInputsType = z.infer<typeof LoginSchema>
