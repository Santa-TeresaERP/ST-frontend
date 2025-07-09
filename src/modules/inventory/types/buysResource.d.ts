import { z } from 'zod';
import { Resource } from './resource';
import { WarehouseAttributes } from './warehouse';
import { Supplier } from './suppliers';

// Esquema de validación para BuysResource
export const BuysResourceSchema = z.object({
  id: z.string().optional(),
  warehouse_id: z.string().uuid('El ID del almacén debe ser un UUID válido'),
  resource_id: z.string().uuid('El ID del recurso debe ser un UUID válido'),
  quantity: z.number({ invalid_type_error: 'La cantidad debe ser un número' }),  
  type_unit: z.string().min(1, 'El tipo de unidad es requerido'),
  unit_price: z.number({ invalid_type_error: 'El precio unitario debe ser un número' }),
  total_cost: z.number({ invalid_type_error: 'El costo total debe ser un número' }),
  supplier_id: z.string().uuid('El ID del proveedor debe ser un UUID válido'),
  entry_date: z.coerce.date({ invalid_type_error: 'La fecha de entrada debe ser válida' }),
});

// Inferir el tipo a partir del esquema
export type BuysResourceAttributes = z.infer<typeof BuysResourceSchema>;

// Tipo extendido que incluye las relaciones cuando el backend las retorna
export interface BuysResourceWithResource extends BuysResourceAttributes {
  resource?: Resource;
  warehouse?: WarehouseAttributes;
  supplier?: Supplier;
}

// Payload para crear un recurso de compra
export interface CreateBuysResourcePayload {
  warehouse_id: string;
  resource_id: string;
  quantity: number;  
  type_unit: string;
  unit_price: number;
  total_cost: number;
  supplier_id: string;
  entry_date: Date;
}

// Payload para actualizar un recurso de compra
export interface UpdateBuysResourcePayload {
  warehouse_id?: string;
  resource_id?: string;
  quantity?: number;  
  type_unit?: string;
  unit_price?: number;
  total_cost?: number;
  supplier_id?: string;
  entry_date?: Date;
}