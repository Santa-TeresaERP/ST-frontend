// filepath: c:\proyecto\ST-frontend\src\modules\inventory\types\warehouseProduct.ts
import { z } from 'zod';

// Schema based on backend model for warehouse products
export const WarehouseProductSchema = z.object({
  id: z.string().uuid(),
  warehouse_id: z.string().uuid(),
  product_id: z.string().uuid(),
  quantity: z.number().min(0, 'Quantity must be greater than or equal to 0'),
  entry_date: z.string().datetime(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional().nullable(),
});

// Infer the TypeScript type from the Zod schema
export type WarehouseProduct = z.infer<typeof WarehouseProductSchema>;

// Payload interface for creating a warehouse product
export interface CreateWarehouseProductPayload {
  warehouse_id: string;
  product_id: string;
  quantity: number;
  entry_date: string;
}

// Payload interface for updating a warehouse product
export interface UpdateWarehouseProductPayload {
  warehouse_id?: string;
  product_id?: string;
  quantity?: number;
  entry_date?: string;
}