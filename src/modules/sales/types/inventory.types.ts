// Interfaz que representa el objeto principal del inventario.
export interface InventoryItem {
  id: string;
  producto: string;
  cantidad: number;
  fecha: string;
}

// Tipo para los datos necesarios al CREAR un nuevo artículo.
export type CreateInventoryItem = Omit<InventoryItem, 'id'>;

// Tipo para los datos necesarios al ACTUALIZAR un artículo.
export type UpdateInventoryItem = Partial<InventoryItem>;