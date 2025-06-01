export interface WarehouseMovementProductAttributes {
  movement_id: string;
  warehouse_id: string;
  store_id: string;
  product_id: string;
  movement_type: 'salida' | 'entrada';
  quantity: number;
  movement_date: Date;
  observations?: string;
  createdAt?: Date;
  updatedAt?: Date;
}