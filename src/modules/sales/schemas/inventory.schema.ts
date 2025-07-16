// src/modules/sales/schemas/inventory.schema.ts
import { z } from 'zod';

export const inventoryFormSchema = z.object({
  producto: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  cantidad: z.coerce
    .number({ invalid_type_error: 'La cantidad debe ser un número.' })
    .min(1, 'La cantidad debe ser al menos 1.'),
  fecha: z.string().min(1, { message: 'La fecha es obligatoria.' }),
});

export type InventoryFormData = z.infer<typeof inventoryFormSchema>;