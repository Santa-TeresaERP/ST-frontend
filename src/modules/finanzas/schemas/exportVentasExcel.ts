import { z } from 'zod'

export const exportVentasExcelSchema = z.object({
  startDate: z.string().min(10, 'La fecha de inicio es obligatoria'),
  endDate: z.string().min(10, 'La fecha de fin es obligatoria'),
})

export type ExportVentasExcelSchema = z.infer<typeof exportVentasExcelSchema>
