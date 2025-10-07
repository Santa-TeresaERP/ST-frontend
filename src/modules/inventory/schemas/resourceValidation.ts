import { z } from "zod";

export const ResourceValidationSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  unit_price: z.string().min(1, "El precio unitario es requerido"),
  type_unit: z.string().min(1, "La unidad es requerida"),
  total_cost: z.number().min(0, "El costo total debe ser mayor o igual a 0"),
  supplier_id: z.string().nullable(),
  observation: z
    .string()
    .max(150, "La observación no debe exceder los 150 caracteres")
    .nullable()
    .optional(),

  purchase_date: z.string().min(1, "La fecha de compra es requerida"),
});
