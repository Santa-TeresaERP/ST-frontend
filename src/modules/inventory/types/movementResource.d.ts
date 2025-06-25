import { z } from 'zod';

export const WarehouseMovementResourceSchema = z.object({
  id: z.string().optional(),
  warehouse_id: z.string(),
  resource_id: z.string(),
  movement_type: z.enum(['salida', 'entrada']),
  quantity: z.number(),
  movement_date: z.union([z.string(), z.date()]),
  observations: z.string().max(150).optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type WarehouseMovementResource = z.infer<typeof WarehouseMovementResourceSchema>;

export interface CreateWarehouseMovementResourcePayload {
  warehouse_id: string;
  resource_id: string;
  movement_type: 'salida' | 'entrada';
  quantity: number;
  movement_date: string | Date;
  observations?: string | null;
}

export interface UpdateWarehouseMovementResourcePayload {
  warehouse_id?: string;
  resource_id?: string;
  movement_type?: 'salida' | 'entrada';
  quantity?: number;
  movement_date?: string | Date;
  observations?: string | null;
}