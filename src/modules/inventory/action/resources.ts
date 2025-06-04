import api from '@/core/config/client';
import { Resource, CreateResourcePayload, UpdateResourcePayload } from '../types/resource';

export const fetchResources = async (): Promise<Resource[]> => {
    const response = await api.get<Resource[]>('/resource');
    return response.data;
    }

export const createResource = async (payload: CreateResourcePayload): Promise<Resource> => {
    const response = await api.post<Resource>('/resource', payload);
    return response.data;
    }

export const updateResource = async (id: string, payload: UpdateResourcePayload): Promise<Resource> => {
    const response = await api.patch<Resource>(`/resource/${id}`, payload);
    return response.data;
    }

export const deleteResource = async (id: string): Promise<void> => {
    await api.delete(`/resource/${id}`);
    }