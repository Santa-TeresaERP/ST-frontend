export interface WarehouseMovementResourceAttributes {
  movement_id: string;
  warehouse_id: string;
  resource_id: string;
  type: string;
  movement_type: string;
  quantity: number;
  movement_date: Date;
  observations?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}