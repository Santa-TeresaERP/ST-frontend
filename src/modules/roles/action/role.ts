import api from '@/core/config/client';
import {Role, CreateRolePayload, UpdateRolePayload} from '../types/roles';

export const fetchRoles = async (): Promise<Role[]> =>{
    const response = await api.get<Role[]>('/roles');
    return response.data;
}

export const getRole = async (id: string): Promise<Role> =>{
    const response = await api.get<Role>(`/roles/${id}`);
    return response.data;
}

export const createRole = async (payload: CreateRolePayload): Promise<Role> =>{
    const response = await api.post<Role>('/roles', payload);
    return response.data;
}

export const updateRole = async (id: string, payload: UpdateRolePayload): Promise<Role> =>{
    const response = await api.patch<Role>(`/roles/${id}`, payload);
    return response.data;
}

export const deleteRole = async (id: string): Promise<void> =>{
    await api.delete(`/roles/${id}`);
}
