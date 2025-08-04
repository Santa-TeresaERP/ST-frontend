import { CreatePermissionPayload, UpdatePermissionPayload, Permission } from "../types/permission";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePermission, getPermission, createPermission, fetchPermissions, getPermissionsByRole } from "../action/permissions";
import { updateRolePermissions, UpdatePermissionResponse } from "../action/role"; // ← Importar la función y tipo correctos

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
  return useMutation<UpdatePermissionResponse, Error, {
    id: string;
    payload: UpdatePermissionPayload;
  }>({
    mutationFn: ({
      id,
      payload
    }) => {
      console.log('🔍 useUpdatePermission - Hook llamado con:', {
        id,
        payload,
        totalPermissions: payload.permissions?.length || 0
      });
      return updateRolePermissions(id, payload); // ← Usar la función correcta
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
    onError: (error, variables) => {
      console.error('❌ useUpdatePermission - Error:', {
        roleId: variables.id,
        error
      });
    }
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