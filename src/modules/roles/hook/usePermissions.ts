import { CreatePermissionPayload, UpdatePermissionPayload, Permission } from "../types/permission";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePermission, getPermission, createPermission, fetchPermissions, getPermissionsByRole } from "../action/permissions";
import { updateRolePermissions, UpdatePermissionResponse } from "../action/role"; // ← Importar la función y tipo correctos
import { useModulePermission, MODULE_NAMES } from '@/core/utils/useModulesMap';

interface AxiosError extends Error {
  response?: {
    status: number;
  };
}

export const useFetchPermissions = () => {
  return useQuery<Permission[], Error>({
    queryKey: ["permissions"],
    queryFn: fetchPermissions
  });
};

export const useFetchPermission = (id: string) => {
  return useQuery<Permission, Error>({
    queryKey: ["permission", id],
    queryFn: () => getPermission(id)
  });
};

// 🆕 NUEVO: Hook para obtener permisos por rol
export const useFetchPermissionsByRole = (roleId: string | null) => {
  return useQuery<Permission[], Error>({
    queryKey: ["permissions", "role", roleId],
    queryFn: () => getPermissionsByRole(roleId!),
    enabled: !!roleId, // Solo ejecutar si hay roleId
    staleTime: 0, // No usar cache, siempre recargar
    refetchOnWindowFocus: true, // Recargar al enfocar ventana
    refetchOnMount: true, // Recargar al montar componente
  });
};

export const useCreatePermission = () => {
  const queryClient = useQueryClient();
  return useMutation<Permission, Error, CreatePermissionPayload>({
    mutationFn: createPermission,
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["permissions"]
    }) 
  });
};

export const useUpdatePermission = () => {
  const queryClient = useQueryClient();
  const { hasPermission: canEdit } = useModulePermission(MODULE_NAMES.ROLES, 'canEdit');
  
  return useMutation<UpdatePermissionResponse, Error, {
    id: string;
    payload: UpdatePermissionPayload;
  }>({
    mutationFn: async ({
      id,
      payload
    }) => {
      if (!canEdit) {
        // Crear un error silencioso
        throw { isPermissionError: true, silent: true, message: 'No tienes permisos para actualizar permisos de roles' };
      }
      
      console.log('🔍 useUpdatePermission - Hook llamado con:', {
        id,
        payload,
        totalPermissions: payload.permissions?.length || 0
      });
      
      try {
        return await updateRolePermissions(id, payload); // ← Usar la función correcta
      } catch (error: unknown) {
        // Si es error 403, convertirlo a error silencioso
        const axiosError = error as AxiosError;
        if (axiosError?.response?.status === 403) {
          throw { isPermissionError: true, silent: true, message: 'Permisos revocados para actualizar permisos de roles' };
        }
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      console.log('✅ useUpdatePermission - Mutation exitosa:', {
        roleId: variables.id,
        response: data
      });
      queryClient.invalidateQueries({
        queryKey: ["permissions"]
      });
      queryClient.invalidateQueries({
        queryKey: ["roles"]
      });
    },
    onError: (error: unknown, variables) => {
      // Solo loggear errores que NO sean silenciosos
      const errorObj = error as { silent?: boolean; isPermissionError?: boolean };
      if (!errorObj?.silent && !errorObj?.isPermissionError) {
        console.error('❌ useUpdatePermission - Error:', {
          roleId: variables.id,
          error
        });
      }
    },
    // Configurar reintentos: NO reintentar errores de permisos
    retry: (failureCount, error: unknown) => {
      const errorObj = error as { isPermissionError?: boolean };
      if (errorObj?.isPermissionError) {
        return false; // No reintentar errores de permisos
      }
      return failureCount < 3; // Reintentar otros errores máximo 3 veces
    },
    retryDelay: 0, // Sin delay entre reintentos
  });
};

export const useDeletePermission = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deletePermission,
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["permissions"]
    })
  });
};