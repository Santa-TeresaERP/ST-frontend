import { CreateUserPayload, UpdateUserPayload, User, ChangePasswordRequest } from '@/modules/user-creations/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteUser, getUser, updateUser, createUser, changePassword } from '../action/user';
import { fetchUsers } from '@/modules/user-creations/action/user';
import { useModulePermission, MODULE_NAMES } from '@/core/utils/useModulesMap';

interface AxiosError extends Error {
  response?: {
    status: number;
  };
}

export const useFetchUsers = () => {
  const { hasPermission: canView } = useModulePermission(MODULE_NAMES.USERS, 'canRead');
  
  return useQuery<User[], Error>({
    queryKey: ['users'], // Simplificar la clave
    queryFn: fetchUsers,
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

export const useFetchUser = (id: string) => {
  const { hasPermission: canView } = useModulePermission(MODULE_NAMES.USERS, 'canRead');
  
  return useQuery<User, Error>({
    queryKey: ['user', id],
    queryFn: () => getUser(id),
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

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { hasPermission: canCreate } = useModulePermission(MODULE_NAMES.USERS, 'canWrite');
  
  return useMutation<User, Error, CreateUserPayload>({
    mutationFn: async (payload: CreateUserPayload) => {
      if (!canCreate) {
        // Retornar un valor especial que indique error silencioso
        throw { isPermissionError: true, silent: true, message: 'No tienes permisos para crear usuarios' };
      }
      try {
        return await createUser(payload);
      } catch (error: unknown) {
        // Si es error 403, convertirlo a error silencioso
        const axiosError = error as AxiosError;
        if (axiosError?.response?.status === 403) {
          throw { isPermissionError: true, silent: true, message: 'Permisos revocados para crear usuarios' };
        }
        throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    onError: (error: unknown) => {
      // Solo loggear errores que NO sean silenciosos
      const errorObj = error as { silent?: boolean; isPermissionError?: boolean };
      if (!errorObj?.silent && !errorObj?.isPermissionError) {
        console.error('Error creating user:', error);
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

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { hasPermission: canEdit } = useModulePermission(MODULE_NAMES.USERS, 'canEdit');
  
  return useMutation<User, Error, { id: string; payload: UpdateUserPayload }>({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateUserPayload }) => {
      if (!canEdit) {
        // Retornar un valor especial que indique error silencioso
        throw { isPermissionError: true, silent: true, message: 'No tienes permisos para editar usuarios' };
      }
      try {
        return await updateUser(id, payload);
      } catch (error: unknown) {
        // Si es error 403, convertirlo a error silencioso
        const axiosError = error as AxiosError;
        if (axiosError?.response?.status === 403) {
          throw { isPermissionError: true, silent: true, message: 'Permisos revocados para editar usuarios' };
        }
        throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    onError: (error: unknown) => {
      // Solo loggear errores que NO sean silenciosos
      const errorObj = error as { silent?: boolean; isPermissionError?: boolean };
      if (!errorObj?.silent && !errorObj?.isPermissionError) {
        console.error('Error updating user:', error);
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

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { hasPermission: canDelete } = useModulePermission(MODULE_NAMES.USERS, 'canDelete');
  
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      if (!canDelete) {
        // Retornar un valor especial que indique error silencioso
        throw { isPermissionError: true, silent: true, message: 'No tienes permisos para eliminar usuarios' };
      }
      try {
        return await deleteUser(id);
      } catch (error: unknown) {
        // Si es error 403, convertirlo a error silencioso
        const axiosError = error as AxiosError;
        if (axiosError?.response?.status === 403) {
          throw { isPermissionError: true, silent: true, message: 'Permisos revocados para eliminar usuarios' };
        }
        throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    onError: (error: unknown) => {
      // Solo loggear errores que NO sean silenciosos
      const errorObj = error as { silent?: boolean; isPermissionError?: boolean };
      if (!errorObj?.silent && !errorObj?.isPermissionError) {
        console.error('Error deleting user:', error);
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

export const useChangePassword = () => {
  const { hasPermission: canEdit } = useModulePermission(MODULE_NAMES.USERS, 'canEdit');
  
  return useMutation<void, Error, ChangePasswordRequest>({
    mutationFn: async (payload: ChangePasswordRequest) => {
      if (!canEdit) {
        throw { isPermissionError: true, silent: true, message: 'No tienes permisos para cambiar contraseñas' };
      }
      try {
        return await changePassword(payload);
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        if (axiosError?.response?.status === 403) {
          throw { isPermissionError: true, silent: true, message: 'Permisos revocados para cambiar contraseñas' };
        }
        throw error;
      }
    },
    onError: (error: unknown) => {
      const errorObj = error as { silent?: boolean; isPermissionError?: boolean };
      if (!errorObj?.silent && !errorObj?.isPermissionError) {
        console.error('Error changing password:', error);
      }
    },
    retry: (failureCount, error: unknown) => {
      const errorObj = error as { isPermissionError?: boolean };
      if (errorObj?.isPermissionError) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: 0,
  });
};
