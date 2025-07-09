// Verified API client import path
import api from '@/core/config/client';
// Verified types import path (assuming correct relative path)
import {
  Resource,
  CreateResourcePayload,
  UpdateResourcePayload,
} from '../types/resource';

// Fetch all resources
export const fetchResources = async (): Promise<Resource[]> => {
  const response = await api.get<Resource[]>('/resource');
  return response.data;
};

// Fetch a single resource by ID
export const getResource = async (id: string): Promise<Resource> => {
  // Ensure the endpoint `/resources/${id}` matches the backend route definition
  const response = await api.get<Resource>(`/resource/${id}`);
  return response.data;
};

// Crear recurso de compra
export const createResource = async (payload: CreateResourcePayload): Promise<Resource> => {
  // Ensure the endpoint '/resources' and HTTP method POST match the backend
  const response = await api.post<Resource>('/resource', payload);
  return response.data;
};

// Editar recurso de compra
export const updateResource = async (id: string, payload: UpdateResourcePayload): Promise<Resource> => {
  // Ensure the endpoint `/resources/${id}` and HTTP method PATCH match the backend
  const response = await api.patch<Resource>(`/resource/${id}`, payload);
  return response.data;
};

// Delete a resource
export const deleteResource = async (id: string): Promise<void> => {
  // Ensure the endpoint `/resources/${id}` and HTTP method DELETE match the backend
  await api.delete(`/resource/${id}`);
};

