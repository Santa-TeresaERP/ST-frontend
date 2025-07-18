// Tipos para el módulo de tiendas (basado en API del backend)
export interface StoreAttributes {
  id: string;              // UUID generado automáticamente
  store_name: string;      // Nombre de la tienda (obligatorio)
  address: string;         // Dirección (obligatorio)
  observations?: string;   // Observaciones (opcional)
  createdAt: Date;         // Fecha de creación
  updatedAt: Date;         // Fecha de actualización
}

export interface CreateStorePayload {
  store_name: string;      // Nombre de la tienda (obligatorio)
  address: string;         // Dirección (obligatorio)
  observations?: string;   // Observaciones (opcional)
}

export interface UpdateStorePayload {
  id: string;
  store_name?: string;
  address?: string;
  observations?: string;
}

export interface StoreResponse {
  data: StoreAttributes[];
  message?: string;
  success?: boolean;
}

export interface SingleStoreResponse {
  data: StoreAttributes;
  message?: string;
  success?: boolean;
}
