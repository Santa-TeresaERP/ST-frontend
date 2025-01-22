import api from '@/core/config/client';
import { Permission, CreatePermissionPayload, UpdatePermissionPayload } from '../types/permission';

export const fetchPermissions = async (): Promise<Permission[]> =>{
    const response = await api.get<Permission[]>('/permissions');
    return response.data;
}

export const getPermission = async (id: string): Promise<Permission> =>{
    const response = await api.get<Permission>(`/permissions/${id}`);
    return response.data;
}

export const createPermission = async (payload: CreatePermissionPayload): Promise<Permission> =>{
    const response = await api.post<Permission>('/permissions', payload);
    return response.data;
}

export const updatePermission = async (id: string, payload: UpdatePermissionPayload): Promise<Permission> =>{
    const response = await api.patch<Permission>(`/permissions/${id}`, payload);
    return response.data;
}

export const deletePermission = async (id: string): Promise<void> =>{
    await api.delete(`/permissions/${id}`);
}