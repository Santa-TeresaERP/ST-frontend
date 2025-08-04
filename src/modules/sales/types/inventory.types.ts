// Interfaces para los objetos anidados que vienen del backend
interface Product {
  id: string;
  name: string;
}

interface Store {
  id: string;
  store_name: string;
}

// Interfaz principal que representa un registro de WarehouseStore
// Este es un ESPEJO EXACTO de la respuesta de tu servicio `serviceGetWarehouseStores`
export interface WarehouseStoreItem {
  id: string;
  quantity: number;
  productId: string; // Incluimos los IDs aunque usemos los nombres de los objetos anidados
  storeId: string;
  createdAt: string;
  updatedAt: string;
  
  // Objetos anidados gracias al 'include' en el servicio del backend
  product: Product;
  store: Store;
}

// --- Tipos para las mutaciones (los creamos ahora para tener la estructura lista) ---

// El payload para crear necesita los 3 campos del formulario.
export type CreateWarehouseStorePayload = {
  productId: string;
  storeId: string;
  quantity: number;
};

// El payload para actualizar necesita los 3 campos del formulario.
export type UpdateWarehouseStorePayload = {
  quantity: number;
};