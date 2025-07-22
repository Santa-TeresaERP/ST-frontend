import api from '@/core/config/client';
import { Permission, CreatePermissionPayload, UpdatePermissionPayload } from '../types/permission';

// 🔄 Funciones auxiliares para conversión de campos
const convertBackendToFrontend = (backendPermission: {
    id: string;
    moduleId: string;
    canRead: boolean;
    canWrite: boolean;
    canEdit: boolean;
    canDelete: boolean;
    Module?: { id: string; name: string };
}): Permission => ({
    ...backendPermission,
    canUpdate: backendPermission.canEdit,
    createdAt: undefined,
    updatedAt: undefined
});

const convertFrontendToBackend = (frontendPermission: {
    moduleId: string;
    canRead: boolean;
    canWrite: boolean;
    canUpdate: boolean;
    canDelete: boolean;
}) => ({
    moduleId: frontendPermission.moduleId,
    canRead: frontendPermission.canRead,
    canWrite: frontendPermission.canWrite,
    canEdit: frontendPermission.canUpdate, // Frontend -> Backend
    canDelete: frontendPermission.canDelete
});

export const fetchPermissions = async (): Promise<Permission[]> =>{
    const response = await api.get<Permission[]>('/permissions');
    return response.data;
}

export const getPermission = async (id: string): Promise<Permission> =>{
    const response = await api.get<Permission>(`/permissions/${id}`);
    return response.data;
}

// 🆕 NUEVO: Obtener permisos por rol ID
export const getPermissionsByRole = async (roleId: string): Promise<Permission[]> =>{
    console.log('🔍 Obteniendo permisos para rol:', roleId);
    try {
        // PRIMERA OPCIÓN: Intentar con el endpoint del rol
        console.log('🔍 Intentando con endpoint /roles/${roleId}...');
        const roleResponse = await api.get(`/roles/${roleId}`);
        console.log('✅ Respuesta del rol:', roleResponse.data);
        console.log('🔍 DEBUG - Response completo:', JSON.stringify(roleResponse.data, null, 2));
        
        const roleData = roleResponse.data;
        console.log('🔍 roleData.Permissions:', roleData.Permissions);
        console.log('🔍 Es array?', Array.isArray(roleData.Permissions));
        console.log('🔍 Longitud:', roleData.Permissions?.length);
        
        // 🚨 DEBUG CRÍTICO: Verificar IDs de permisos duplicados
        if (roleData.Permissions && Array.isArray(roleData.Permissions)) {
            console.log('🚨 VERIFICANDO IDs DE PERMISOS:');
            roleData.Permissions.forEach((perm: Record<string, unknown>, index: number) => {
                console.log(`  [${index}] Permiso ID: ${perm.id} | Módulo: ${(perm.Module as Record<string, unknown>)?.name} | roleId consultado: ${roleId}`);
            });
            
            console.log('📋 Permisos RAW del backend:', roleData.Permissions);
            const convertedPermissions = roleData.Permissions.map(convertBackendToFrontend);
            console.log('🔄 Permisos convertidos (canEdit -> canUpdate):', convertedPermissions);
            return convertedPermissions;
        }
        
        // SEGUNDA OPCIÓN: Si el rol no tiene permisos, intentar con endpoint de permisos directamente
        console.log('⚠️ No se encontraron permisos en el rol, intentando con /permissions...');
        
        try {
            const permissionsResponse = await api.get(`/permissions?roleId=${roleId}`);
            console.log('✅ Respuesta de permisos directos:', permissionsResponse.data);
            
            if (permissionsResponse.data && Array.isArray(permissionsResponse.data)) {
                const convertedPermissions = permissionsResponse.data.map(convertBackendToFrontend);
                console.log('🔄 Permisos convertidos desde /permissions:', convertedPermissions);
                return convertedPermissions;
            }
        } catch (permError) {
            console.log('⚠️ Error en endpoint /permissions:', permError);
        }
        
        console.log('⚠️ No se encontraron permisos en ningún endpoint');
        return [];
    } catch (error) {
        console.error('❌ Error obteniendo permisos del rol:', error);
        return [];
    }
}

export const createPermission = async (payload: CreatePermissionPayload): Promise<Permission> =>{
    const response = await api.post<Permission>('/permissions', payload);
    return response.data;
}

export const updatePermission = async (id: string, payload: UpdatePermissionPayload): Promise<Permission> =>{
    console.log('🚀 Enviando a API - updatePermissionForRole:', {
        roleId: id,
        url: `/permissions/role/${id}`,
        method: 'PATCH',
        payload: payload,
        totalModules: payload.permissions?.length || 0,
        permissionsDetail: payload.permissions?.map(p => ({
            moduleId: p.moduleId,
            permissions: `R:${p.canRead} W:${p.canWrite} U:${p.canUpdate} D:${p.canDelete}`
        }))
    });
    
    // 🔄 Convertir canUpdate -> canEdit para el backend
    const convertedPayload = {
        ...payload,
        permissions: payload.permissions?.map(convertFrontendToBackend)
    };

    console.log('🔄 Payload convertido (canUpdate -> canEdit):', convertedPayload);
    
    // 🆕 NUEVA URL: Usar endpoint específico para el rol
    const response = await api.patch<Permission>(`/permissions/role/${id}`, convertedPayload);
    
    console.log('✅ Respuesta de API - updatePermissionForRole:', response.data);
    return response.data;
}

export const deletePermission = async (id: string): Promise<void> =>{
    await api.delete(`/permissions/${id}`);
}