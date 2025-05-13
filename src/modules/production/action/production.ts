import api from '@/core/config/client';
import { Production } from '../types/productions';

export const fetchProductions = async (): Promise<Production[]> => {
    const response = await api.get<Production[]>('/production');
    return response.data;
}

export const createProduction = async (payload: Production): Promise<Production> => {
    const response = await api.post<Production>('/production', payload);
    return response.data;
}

export const updateProduction = async (id: string, payload: Production): Promise<Production> => {
    const response = await api.patch<Production>(`/production/${id}`, payload);
    return response.data;
}

export const deleteProduction = async (id: string): Promise<void> => {
    await api.delete(`/production/${id}`);
}