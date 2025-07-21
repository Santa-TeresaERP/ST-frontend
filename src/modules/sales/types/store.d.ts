// Interfaz que representa el objeto principal de la tienda.
export interface StoreAttributes {
  id: string;
  store_name: string;
  address: string;
  observations?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipo para los datos necesarios al CREAR una nueva tienda.
export type CreateStoreRequest = Omit<StoreAttributes, 'id' | 'createdAt' | 'updatedAt'>;

// Tipo para los datos necesarios al ACTUALIZAR una tienda.
export type UpdateStoreRequest = Partial<CreateStoreRequest> & { id: string };

// Respuesta de la API para listado de tiendas con paginación.
export interface StoreResponse {
  stores: StoreAttributes[];
  total: number;
  page: number;
  limit: number;
}
