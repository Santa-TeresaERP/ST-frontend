import { z } from "zod";

export const returnSchema = z.object({
  productId: z
    .string({ required_error: "El producto es obligatorio" })
    .uuid("ID de producto inválido"),
  salesId: z
    .string({ required_error: "La venta es obligatoria" })
    .uuid("ID de venta inválido"),
  reason: z
    .string({ required_error: "La razón es obligatoria" })
    .min(1, "Debes ingresar una razón"),
  observations: z
    .string({ required_error: "La observación es obligatoria" })
    .min(1, "Debes ingresar observaciones"),
  quantity: z
    .number({ required_error: "La cantidad es obligatoria" })
    .min(1, "La cantidad debe ser al menos 1"),

  // opcional: solo si decides enviar price desde el frontend
  price: z
    .number({ invalid_type_error: "El precio debe ser un número" })
    .nonnegative("El precio no puede ser negativo")
    .optional(),
});
