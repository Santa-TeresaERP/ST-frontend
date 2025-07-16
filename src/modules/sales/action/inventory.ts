/*import api from '@/core/config/client';
import { InventoryItem, CreateInventoryItem, UpdateInventoryItem } from '../types/inventory.types';

export const fetchInventory = async (): Promise<InventoryItem[]> => {
  const response = await api.get<InventoryItem[]>('/inventory');
  return response.data;
};

export const createInventoryProduct = async (payload: CreateInventoryItem): Promise<InventoryItem> => {
  const response = await api.post<InventoryItem>('/inventory', payload);
  return response.data;
};

export const updateInventoryProduct = async (id: string, payload: UpdateInventoryItem): Promise<InventoryItem> => {
  const response = await api.patch<InventoryItem>(`/inventory/${id}`, payload);
  return response.data;
};

export const deleteInventoryProduct = async (id: string): Promise<void> => {
  await api.delete(`/inventory/${id}`);
};*/


//Simulacion de backend

import { InventoryItem, CreateInventoryItem, UpdateInventoryItem } from '../types/inventory.types';

// Datos falsos para simular la base de datos
let mockInventory: InventoryItem[] = [
  { id: '1', producto: 'Harina Mock', cantidad: 50, fecha: '2025-07-15' },
  { id: '2', producto: 'Azúcar Mock', cantidad: 30, fecha: '2025-07-14' },
  { id: '3', producto: 'Huevos Mock', cantidad: 120, fecha: '2025-07-16' },
];

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const fetchInventory = async (): Promise<InventoryItem[]> => {
  console.log('ACTION: Fetching mock inventory...');
  await simulateDelay(500); // Simula una demora de red de 1.5 segundos
  // En lugar de llamar a `api.get`, devolvemos nuestros datos falsos.
  return Promise.resolve(mockInventory);
};

export const createInventoryProduct = async (payload: CreateInventoryItem): Promise<InventoryItem> => {
  console.log('ACTION: Creating mock product...', payload);
  await simulateDelay(100);
  const newProduct: InventoryItem = {
    id: Date.now().toString(),
    ...payload, 
  };
  mockInventory = [...mockInventory, newProduct];
  return Promise.resolve(newProduct);
};

export const updateInventoryProduct = async (id: string, payload: UpdateInventoryItem): Promise<InventoryItem> => {
  console.log(`ACTION: Updating mock product ${id}...`, payload);
  await simulateDelay(100);
  let updatedProduct: InventoryItem | undefined;
  mockInventory = mockInventory.map(item => {
    if (item.id === id) {
      updatedProduct = { ...item, ...payload };
      return updatedProduct;
    }
    return item;
  });
  if (!updatedProduct) throw new Error("Producto no encontrado");
  return Promise.resolve(updatedProduct);
};

export const deleteInventoryProduct = async (id: string): Promise<void> => {
  console.log(`ACTION: Deleting mock product ${id}...`);
  await simulateDelay(100);
  mockInventory = mockInventory.filter(item => item.id !== id);
  return Promise.resolve();
};