export interface WarehouseProduct {
  id: string
  warehouse_id: string
  product_id: string
  quantity: number
  entry_date: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateWarehouseProductPayload {
  warehouse_id: string
  product_id: string
  quantity: number
  entry_date: string
}

export interface UpdateWarehouseProductPayload {
  warehouse_id?: string
  product_id?: string
  quantity?: number
  entry_date?: string
}
