import { z } from 'zod';
import { Product } from './product';
import { WarehouseAttributes } from './warehouse';
import { Supplier } from './suppliers';

// Esquema de validación para BuysProduct
export const BuysProductSchema = z.object({
  id: z.string().uuid().optional(),
  warehouse_id: z.string().uuid('El ID del almacén debe ser un UUID válido'),
  product_id: z.string().uuid('El ID del producto debe ser un UUID válido'),
  quantity: z.number().positive('La cantidad debe ser mayor a 0'),
  unit_price: z.number().positive('El precio unitario debe ser mayor a 0'),
  total_cost: z.number().positive('El costo total debe ser mayor a 0'),
  supplier_id: z.string().uuid('El ID del proveedor debe ser un UUID válido'),
  entry_date: z.coerce.date({ invalid_type_error: 'La fecha de entrada debe ser válida' }),
  status: z.boolean().default(true),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// Inferir el tipo a partir del esquema
export type BuysProductAttributes = z.infer<typeof BuysProductSchema>;

// Tipo extendido que incluye las relaciones cuando el backend las retorna
export interface BuysProductWithRelations extends BuysProductAttributes {
  warehouse?: WarehouseAttributes;
  product?: Product;
  supplier?: Supplier;
}

// Payload para crear una compra de producto
export interface CreateBuysProductPayload {
  warehouse_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_cost: number;
  supplier_id: string;
  entry_date: string; // YYYY-MM-DD
  status?: boolean;
}

// Payload para actualizar una compra de producto
export interface UpdateBuysProductPayload {
  warehouse_id?: string;
  product_id?: string;
  quantity?: number;
  unit_price?: number;
  total_cost?: number;
  supplier_id?: string;
  entry_date?: string; // YYYY-MM-DD
  status?: boolean;
}

// Response del backend al crear/actualizar
export interface BuysProductResponse {
  success: boolean;
  product?: BuysProductWithRelations;
  movement?: unknown;
  action?: 'created' | 'updated';
  message?: string;
  error?: string;
  details?: string[];
}
