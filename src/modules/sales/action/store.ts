import { CreateStoreRequest, UpdateStoreRequest, StoreAttributes, StoreResponse } from '../types/store.d';

// Datos falsos para simular la base de datos
let mockStores: StoreAttributes[] = [
  { 
    id: '1', 
    store_name: 'Tienda Santa Teresa', 
    address: 'Av. Principal 123', 
    observations: 'Tienda principal del monasterio',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  { 
    id: '2', 
    store_name: 'Tienda Goyeneche', 
    address: 'Calle Goyeneche 456', 
    observations: 'Sucursal en el centro histórico',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15')
  },
  { 
    id: '3', 
    store_name: 'Tienda Santa Catalina', 
    address: 'Plaza Santa Catalina 789', 
    observations: 'Tienda cerca del monasterio',
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-02-01')
  },
];

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Obtener todas las tiendas
export const fetchStores = async (page: number = 1, limit: number = 10): Promise<StoreResponse> => {
  console.log('ACTION: Fetching mock stores...');
  await simulateDelay(500);
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedStores = mockStores.slice(startIndex, endIndex);
  
  return Promise.resolve({
    stores: paginatedStores,
    total: mockStores.length,
    page,
    limit
  });
};

// Obtener una tienda por ID
export const fetchStoreById = async (id: string): Promise<StoreAttributes> => {
  console.log(`ACTION: Fetching mock store ${id}...`);
  await simulateDelay(300);
  
  const store = mockStores.find(s => s.id === id);
  if (!store) {
    throw new Error('Tienda no encontrada');
  }
  
  return Promise.resolve(store);
};

// Crear una nueva tienda
export const createStore = async (data: CreateStoreRequest): Promise<StoreAttributes> => {
  console.log('ACTION: Creating mock store...', data);
  await simulateDelay(500);
  
  const newStore: StoreAttributes = {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  mockStores = [...mockStores, newStore];
  return Promise.resolve(newStore);
};

// Actualizar una tienda existente
export const updateStore = async (data: UpdateStoreRequest): Promise<StoreAttributes> => {
  console.log(`ACTION: Updating mock store ${data.id}...`, data);
  await simulateDelay(400);
  
  const { id, ...updateData } = data;
  let updatedStore: StoreAttributes | undefined;
  
  mockStores = mockStores.map(store => {
    if (store.id === id) {
      updatedStore = { 
        ...store, 
        ...updateData,
        updatedAt: new Date()
      };
      return updatedStore;
    }
    return store;
  });
  
  if (!updatedStore) {
    throw new Error('Tienda no encontrada');
  }
  
  return Promise.resolve(updatedStore);
};

// Eliminar una tienda
export const deleteStore = async (id: string): Promise<void> => {
  console.log(`ACTION: Deleting mock store ${id}...`);
  await simulateDelay(300);
  
  const storeExists = mockStores.some(store => store.id === id);
  if (!storeExists) {
    throw new Error('Tienda no encontrada');
  }
  
  mockStores = mockStores.filter(store => store.id !== id);
  return Promise.resolve();
};

// Buscar tiendas por nombre
export const searchStores = async (query: string): Promise<StoreAttributes[]> => {
  console.log(`ACTION: Searching mock stores for "${query}"...`);
  await simulateDelay(200);
  
  const filteredStores = mockStores.filter(store =>
    store.store_name.toLowerCase().includes(query.toLowerCase()) ||
    store.address.toLowerCase().includes(query.toLowerCase())
  );
  
  return Promise.resolve(filteredStores);
};
