export interface Supplier {
  id?: string;
  ruc?: number;
  suplier_name: string; // <--- Cambiado aquí
  contact_name: string;
  email: string;
  phone: number;
  address: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateSupplierPayload {
  ruc?: number;
  suplier_name: string; // <--- Cambiado aquí
  contact_name: string;
  email: string;
  phone: number;
  address: string;
}

export interface UpdateSupplierPayload {
  ruc?: number;
  suplier_name?: string; // <--- Cambiado aquí
  contact_name?: string;
  email?: string;
  phone?: number;
  address?: string;
}