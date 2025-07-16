import api from '@/core/config/client';
import { CreateProductPayload, Product, UpdateProductPayload } from '../types/products';

// SIN CAMBIOS
export const fetchProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>('/products');
  return response.data;
};

// --- CAMBIO CLAVE AQUÍ ---
// La función ahora debe aceptar el mismo tipo de unión que el hook
export const createProduct = async (
  payload: CreateProductPayload | FormData
): Promise<Product> => {
  // Ya no se construye un FormData aquí.
  // La función simplemente reenvía el payload que recibe (que ya puede ser un FormData).
  // Y recuerda, NUNCA se debe establecer la cabecera 'Content-Type' manualmente para FormData.
  const response = await api.post<Product>('/products', payload);
  return response.data;
};

// --- CAMBIO SUGERIDO PARA FUTURO ---
// Es una buena práctica que la función de actualización también sea flexible,
// para cuando quieras permitir la edición de imágenes.
export const updateProduct = async (
  id: string, 
  payload: UpdateProductPayload | FormData // <-- Actualizado también
): Promise<Product> => {
  const response = await api.patch<Product>(`/products/${id}`, payload);
  return response.data;
};

// SIN CAMBIOS
export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};