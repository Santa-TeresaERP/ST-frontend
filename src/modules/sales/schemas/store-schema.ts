import { z } from "zod";

// Schema para crear tienda (basado en API del backend)
export const createStoreSchema = z.object({
  store_name: z
    .string()
    .min(1, "El nombre de la tienda es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  
  address: z
    .string()
    .min(1, "La dirección es obligatoria")
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(200, "La dirección no puede exceder 200 caracteres"),
  
  observations: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 500, {
      message: "Las observaciones no pueden exceder 500 caracteres",
    }),
});

// Schema para editar tienda
export const updateStoreSchema = z.object({
  id: z.string().min(1, "ID de tienda requerido"),
  store_name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .optional(),
  
  address: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(200, "La dirección no puede exceder 200 caracteres")
    .optional(),
  
  observations: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 500, {
      message: "Las observaciones no pueden exceder 500 caracteres",
    }),
});

// Tipos inferidos de los schemas
export type CreateStoreFormData = z.infer<typeof createStoreSchema>;
export type UpdateStoreFormData = z.infer<typeof updateStoreSchema>;
