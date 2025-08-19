import { UpdateModulePayload, Module } from "../types/modules";
import {  fetchModules, getModule, updateModules } from "../action/module";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from '@/core/store/auth';

export const useFetchModules = () => {
  const { userWithPermissions } = useAuthStore();
  
  // 🔥 VERIFICAR PERMISOS ANTES DE HACER LA PETICIÓN
  // Buscar si el usuario tiene al menos un permiso de lectura en algún módulo
  const userHasAnyReadPermission = userWithPermissions?.Role?.Permissions?.some(
    permission => permission.canRead === true
  ) ?? false;

  return useQuery<Module[], Error>({
    queryKey: ["modules"],
    queryFn: async () => {
      // Intentar la petición solo si tiene algunos permisos básicos
      if (!userHasAnyReadPermission) {
        console.log('🚫 Usuario sin permisos de lectura - omitiendo petición a /modules');
        return [];
      }
      
      try {
        return await fetchModules();
      } catch (error: unknown) {
        const axiosError = error as { response?: { status: number } };
        
        // Si es 403, significa que no tiene permisos específicos para /modules
        if (axiosError?.response?.status === 403) {
          console.log('🚫 Error 403 al acceder a /modules - usuario sin permisos específicos');
          return []; // Devolver array vacío en lugar de error
        }
        
        // Para otros errores, re-lanzar
        console.error('Error al obtener módulos:', error);
        throw error;
      }
    },
    // Solo habilitar la query si el usuario está autenticado y tiene algún permiso
    enabled: !!userWithPermissions && userHasAnyReadPermission,
    retry: (failureCount, error) => {
      // No reintentar para errores 403
      const axiosError = error as { response?: { status: number } };
      if (axiosError?.response?.status === 403) {
        return false;
      }
      return failureCount < 2; // Máximo 2 reintentos para otros errores
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useFetchModule = (id: string) => {
  return useQuery<Module, Error>({
    queryKey: ["modules", id],
    queryFn: () => getModule(id)
  });
};

export const useUpdateModule = () => {
  const queryClient = useQueryClient();
  return useMutation<Module, Error, {
    id: string;
    payload: UpdateModulePayload;
  }>({
    mutationFn: ({
      id,
      payload
    }) => updateModules(id, payload),
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["modules"]
    }),
    // 🔥 NO MOSTRAR ERRORES 403 EN CONSOLA - LOS MANEJAMOS EN EL COMPONENTE
    onError: (error) => {
      // Solo mostrar en consola errores que NO sean 403
      if (!error.message.includes('403') && !error.message.includes('Forbidden')) {
        console.error('Mutation error:', error);
      }
    }
  });
};
