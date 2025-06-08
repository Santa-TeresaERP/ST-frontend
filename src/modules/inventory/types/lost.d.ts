export interface SupplierLost {
  id: string;
  supplier_id: string;
  product_id: string;
  quantity: number;
  lost_type: string;
  observations: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateSupplierLostPayload {
  supplier_id: string;
  product_id: string;
  quantity: number;
  lost_type: string;
  observations: string;
}

export interface UpdateSupplierLostPayload {
  supplier_id?: string;
  product_id?: string;
  quantity?: number;
  lost_type?: string;
  observations?: string;
}
