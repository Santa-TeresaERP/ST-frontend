import { z } from 'zod';

// Define el esquema de validación para WarehouseResource
export const WarehouseResourceSchema = z.object({
  id: z.string().optional(),
  warehouse_id: z.string().uuid('El ID del almacén debe ser un UUID válido'),
  resource_id: z.string().uuid('El ID del recurso debe ser un UUID válido'),
  quantity: z.number({ invalid_type_error: 'La cantidad debe ser un número' }),
  entry_date: z.coerce.date({
    invalid_type_error: 'La fecha de entrada debe ser válida',
  }),
});

// Inferir el tipo a partir del esquema
export type WarehouseResourceAttributes = z.infer<typeof WarehouseResourceSchema>;

// Define las interfaces para crear y actualizar recursos del almacén
export interface CreateWarehouseResourcePayload {
  warehouse_id: string;
  resource_id: string;
  quantity: number;
  entry_date: Date;
}

export interface UpdateWarehouseResourcePayload {
  warehouse_id?: string;
  resource_id?: string;
  quantity?: number;
  entry_date?: Date;
}