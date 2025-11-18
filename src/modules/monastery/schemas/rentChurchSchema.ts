import { z } from 'zod';

export const rentChurchSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'El nombre debe ser una cadena de texto válida',
    })
    .min(1, {
      message: 'El nombre es requerido',
    })
    .max(100, {
      message: 'El nombre no puede exceder los 100 caracteres',
    }),

  type: z.enum(['matrimonio', 'bautizo', 'otros'], {
    invalid_type_error: 'El tipo debe ser matrimonio, bautizo u otros',
  }),

  startTime: z
    .string({
      invalid_type_error:
        'La hora de inicio debe ser una cadena de texto válida',
    })
    .min(1, {
      message: 'La hora de inicio es requerida',
    }),

  endTime: z
    .string({
      invalid_type_error: 'La hora de fin debe ser una cadena de texto válida',
    })
    .min(1, {
      message: 'La hora de fin es requerida',
    }),

  price: z
    .number({
      invalid_type_error: 'El precio debe ser un número válido',
    })
    .positive({
      message: 'El precio debe ser un valor positivo',
    }),

  status: z.boolean().optional().default(true),

  date: z
    .string({
      invalid_type_error: 'La fecha debe ser una cadena de texto válida',
    })
    .min(1, {
      message: 'La fecha es requerida',
    }),

  idChurch: z.string().uuid({
    message: 'El ID de la iglesia debe ser un UUID válido',
  }),
});

export const updateRentChurchSchema = rentChurchSchema.partial();

export type RentChurchSchemaType = z.infer<typeof rentChurchSchema>;
export type UpdateRentChurchSchemaType = z.infer<typeof updateRentChurchSchema>;
