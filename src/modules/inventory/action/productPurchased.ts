import api from '@/core/config/client';
import {
  ProductPurchased,
  CreateProductPurchasedPayload,
  UpdateProductPurchasedPayload
} from '../types/productPurchased';

const PRODUCT_PURCHASED_ENDPOINT = '/productPurchased';

/**
 * Llama a: GET /productPurchased
 * Obtiene la lista de todos los productos comprados activos.
 */
export const fetchProductPurchased = async (): Promise<ProductPurchased[]> => {
  const response = await api.get<ProductPurchased[]>(PRODUCT_PURCHASED_ENDPOINT);
  return response.data;
};

/**
 * Llama a: POST /productPurchased
 * Crea un nuevo producto comprado.
 */
export const createProductPurchased = async (payload: CreateProductPurchasedPayload): Promise<ProductPurchased> => {
  const response = await api.post<ProductPurchased>(PRODUCT_PURCHASED_ENDPOINT, payload);
  return response.data;
};

/**
 * Llama a: PATCH /productPurchased/:id
 * Actualiza un producto comprado existente.
 */
export const updateProductPurchased = async (id: string, payload: UpdateProductPurchasedPayload): Promise<ProductPurchased> => {
  const response = await api.patch<ProductPurchased>(`${PRODUCT_PURCHASED_ENDPOINT}/${id}`, payload);
  return response.data;
};

/**
 * Llama a: DELETE /productPurchased/:id
 * Realiza un borrado lógico de un producto comprado.
 */
export const deleteProductPurchased = async (id: string): Promise<void> => {
  await api.delete(`${PRODUCT_PURCHASED_ENDPOINT}/${id}`);
};