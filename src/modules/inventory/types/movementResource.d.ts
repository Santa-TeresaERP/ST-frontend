export interface WarehouseMovementResourceAttributes {
  id: string; // Renamed from movement_id
  warehouse_id: string;
  resource_id: string;
  movement_type: string; // Kept this, removed 'type'
  quantity: number;
  movement_date: Date;
  observations?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}