import { z } from 'zod';

/**
 * Schema para el formulario de CREACIÓN de un reporte financiero.
 * Valida el rango de fechas que el usuario selecciona.
 */
export const createReportFormSchema = z.object({
  start_date: z.string().min(1, { message: 'La fecha de inicio es obligatoria.' }),
  end_date: z.string().min(1, { message: 'La fecha de fin es obligatoria.' }),
  observations: z.string().optional(),
}).refine(data => new Date(data.start_date) <= new Date(data.end_date), {
  message: "La fecha de fin no puede ser anterior a la fecha de inicio.",
  path: ["end_date"], // Asocia el error al campo de fecha de fin
});

/**
 * Schema para el formulario de EDICIÓN de las observaciones de un reporte.
 */
export const updateReportFormSchema = z.object({
  observations: z.string().max(500, 'Las observaciones no pueden exceder los 500 caracteres.').optional(),
});

// Tipos inferidos para usar con react-hook-form
export type CreateReportFormData = z.infer<typeof createReportFormSchema>;
export type UpdateReportFormData = z.infer<typeof updateReportFormSchema>;