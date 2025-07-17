import api from '@/core/config/client';
import {Role, CreateRolePayload, UpdateRolePayload} from '../types/roles';
import { UpdatePermissionPayload } from '../types/permission';

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

export const updateRolePermissions = async (roleId: string, payload: UpdatePermissionPayload): Promise<Role> => {
    console.log('🚀 Enviando permisos de rol a API:', {
        url: `/roles/${roleId}/permissions`,
        method: 'PATCH',
        payload
    });
    
    try {
        // Intentar el endpoint específico de rol primero
        const response = await api.patch<Role>(`/roles/${roleId}/permissions`, payload);
        return response.data;
    } catch (error) {
        console.log('⚠️ Endpoint /roles/{id}/permissions falló, intentando /permissions/{id}...', error);
        // Si falla, intentar el endpoint de permisos original
        const response = await api.patch<Role>(`/permissions/${roleId}`, payload);
        return response.data;
    }
}
