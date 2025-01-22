import api from '@/core/config/client';
import { Module , UpdateModulePayload} from '../types/modules';

export const fetchModules = async (): Promise<Module[]> =>{
    const response = await api.get<Module[]>('/modules');
    return response.data;
}

export const getModule = async (id: string): Promise<Module> =>{
    const response = await api.get<Module>(`/modules/${id}`);
    return response.data;
}

export const updateModules = async (id: string, payload: UpdateModulePayload): Promise<Module> =>{
    const response = await api.patch<Module>(`/modules/${id}`, payload);
    return response.data;
}