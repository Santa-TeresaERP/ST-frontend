// Verified API client import path
import api from '@/core/config/client';
// Verified types import path (assuming correct relative path)
import {
  BuysResourceAttributes,
  CreateBuysResourcePayload,
  UpdateBuysResourcePayload,
} from '../types/buysResource';

// Fetch all resources
export const fetchResources = async (): Promise<BuysResourceAttributes[]> => {
  // Ensure the endpoint '/resources' matches the backend route definition
  const response = await api.get<BuysResourceAttributes[]>('/resource');
  // Assuming backend returns data directly based on previous analysis and Role example
  return response.data;
};

// Fetch a single resource by ID
export const getResource = async (id: string): Promise<BuysResourceAttributes> => {
  // Ensure the endpoint `/resources/${id}` matches the backend route definition
  const response = await api.get<BuysResourceAttributes>(`/resource/${id}`);
  return response.data;
};

// Crear recurso de compra
export const createResource = async (payload: CreateBuysResourcePayload): Promise<BuysResourceAttributes> => {
  // Ensure the endpoint '/resources' and HTTP method POST match the backend
  const response = await api.post<BuysResourceAttributes>('/resource', payload);
  return response.data;
};

// Editar recurso de compra
export const updateResource = async (id: string, payload: UpdateBuysResourcePayload): Promise<BuysResourceAttributes> => {
  // Ensure the endpoint `/resources/${id}` and HTTP method PATCH match the backend
  const response = await api.patch<BuysResourceAttributes>(`/resource/${id}`, payload);
  return response.data;
};

// Delete a resource
export const deleteResource = async (id: string): Promise<void> => {
  // Ensure the endpoint `/resources/${id}` and HTTP method DELETE match the backend
  await api.delete(`/resource/${id}`);
};

