export interface WarehouseMovementProductAttributes {
  id: string;
  warehouse_id: string;
  store_id?: string | null;
  product_id: string;
  movement_type: 'salida' | 'entrada';
  quantity: number;
  movement_date: Date;
  observations?: string;
  status: boolean ;
  createdAt?: Date;
  updatedAt?: Date;
}