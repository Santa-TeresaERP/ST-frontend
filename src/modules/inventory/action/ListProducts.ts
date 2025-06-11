import api from '@/core/config/client';
import {
  ProductAttributes,
  CreateProductPayload,
  UpdateProductPayload,
} from '../types/ListProduct';

// Obtener todos los productos
export const fetchProducts = async (): Promise<ProductAttributes[]> => {
  const response = await api.get<ProductAttributes[]>('/products');
  return response.data;
};

// Obtener un producto por ID
export const fetchProductById = async (id: string): Promise<ProductAttributes> => {
  const response = await api.get<ProductAttributes>(`/products/${id}`);
  return response.data;
};

// Crear un nuevo producto (con imagen)
export const createProduct = async (payload: CreateProductPayload): Promise<ProductAttributes> => {
  const formData = new FormData();
  formData.append('name', payload.name);
  formData.append('category_id', payload.category_id);
  formData.append('price', String(payload.price));
  formData.append('description', payload.description);
  if (payload.image) {
    formData.append('image', payload.image);
  }

  const response = await api.post<ProductAttributes>('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Actualizar un producto existente
export const updateProduct = async (
  id: string,
  payload: UpdateProductPayload
): Promise<ProductAttributes> => {
  const formData = new FormData();
  if (payload.name) formData.append('name', payload.name);
  if (payload.category_id) formData.append('category_id', payload.category_id);
  if (payload.price !== undefined) formData.append('price', String(payload.price));
  if (payload.description) formData.append('description', payload.description);
  if (payload.image) formData.append('image', payload.image);

  const response = await api.patch<ProductAttributes>(`/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Eliminar un producto
export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};
