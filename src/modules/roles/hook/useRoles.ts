import { CreateRolePayload, UpdateRolePayload, Role } from "../types/roles";
import { UpdatePermissionPayload } from "../types/permission";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteRole, getRole, createRole, updateRole, fetchRoles, updateRolePermissions } from "../action/role";
import { useModulePermission, MODULE_NAMES } from '@/core/utils/useModulesMap';

interface AxiosError extends Error {
  response?: {
    status: number;
  };
}

export const useFetchRoles = () => {
  const { hasPermission: canView } = useModulePermission(MODULE_NAMES.ROLES, 'canRead');
  
  return useQuery<Role[], Error>({
    queryKey: ["roles"], // Simplificar la clave
    queryFn: fetchRoles,
    enabled: canView, // Solo hacer la petición si tiene permisos
    retry: (failureCount, error: Error) => {
      // No reintentar para errores 403
      const axiosError = error as AxiosError;
      if (axiosError?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: canView ? 5 * 60 * 1000 : 0, // 5 minutos si tiene permisos, 0 si no
  });
};

export const useFetchRole = (id: string) => {
  const { hasPermission: canView } = useModulePermission(MODULE_NAMES.ROLES, 'canRead');
  
  return useQuery<Role, Error>({
    queryKey: ["role", id],
    queryFn: () => getRole(id),
    enabled: canView && !!id, // Solo hacer la petición si tiene permisos y hay ID
    retry: (failureCount, error: Error) => {
      // No reintentar para errores 403
      const axiosError = error as AxiosError;
      if (axiosError?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  const { hasPermission: canCreate } = useModulePermission(MODULE_NAMES.ROLES, 'canWrite');
  
  return useMutation<Role, Error, CreateRolePayload>({
    mutationFn: async (payload: CreateRolePayload) => {
      if (!canCreate) {
        // Crear un error silencioso
        throw { isPermissionError: true, silent: true, message: 'No tienes permisos para crear roles' };
      }
      try {
        return await createRole(payload);
      } catch (error: unknown) {
        // Si es error 403, convertirlo a error silencioso
        const axiosError = error as AxiosError;
        if (axiosError?.response?.status === 403) {
          throw { isPermissionError: true, silent: true, message: 'Permisos revocados para crear roles' };
        }
        throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["roles"]
    }),
    onError: (error: unknown) => {
      // Solo loggear errores que NO sean silenciosos
      const errorObj = error as { silent?: boolean; isPermissionError?: boolean };
      if (!errorObj?.silent && !errorObj?.isPermissionError) {
        console.error('Error creating role:', error);
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

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  const { hasPermission: canEdit } = useModulePermission(MODULE_NAMES.ROLES, 'canEdit');
  
  return useMutation<Role, Error, {
    id: string;
    payload: UpdateRolePayload;
  }>({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateRolePayload }) => {
      if (!canEdit) {
        // Crear un error silencioso
        throw { isPermissionError: true, silent: true, message: 'No tienes permisos para editar roles' };
      }
      try {
        return await updateRole(id, payload);
      } catch (error: unknown) {
        // Si es error 403, convertirlo a error silencioso
        const axiosError = error as AxiosError;
        if (axiosError?.response?.status === 403) {
          throw { isPermissionError: true, silent: true, message: 'Permisos revocados para editar roles' };
        }
        throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["roles"]
    }),
    onError: (error: unknown) => {
      // Solo loggear errores que NO sean silenciosos
      const errorObj = error as { silent?: boolean; isPermissionError?: boolean };
      if (!errorObj?.silent && !errorObj?.isPermissionError) {
        console.error('Error updating role:', error);
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

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  const { hasPermission: canDelete } = useModulePermission(MODULE_NAMES.ROLES, 'canDelete');
  
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      if (!canDelete) {
        // Crear un error silencioso
        throw { isPermissionError: true, silent: true, message: 'No tienes permisos para eliminar roles' };
      }
      try {
        return await deleteRole(id);
      } catch (error: unknown) {
        // Si es error 403, convertirlo a error silencioso
        const axiosError = error as AxiosError;
        if (axiosError?.response?.status === 403) {
          throw { isPermissionError: true, silent: true, message: 'Permisos revocados para eliminar roles' };
        }
        throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["roles"]
    }),
    onError: (error: unknown) => {
      // Solo loggear errores que NO sean silenciosos
      const errorObj = error as { silent?: boolean; isPermissionError?: boolean };
      if (!errorObj?.silent && !errorObj?.isPermissionError) {
        console.error('Error deleting role:', error);
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

export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();
  return useMutation<Role, Error, {
    roleId: string;
    payload: UpdatePermissionPayload;
  }>({
    mutationFn: ({
      roleId,
      payload
    }) => updateRolePermissions(roleId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roles"]
      });
      queryClient.invalidateQueries({
        queryKey: ["permissions"]
      });
    }
  });
};

