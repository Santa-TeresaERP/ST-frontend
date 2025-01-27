import { CreatePermissionPayload, UpdatePermissionPayload, Permission } from "../types/permission";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePermission, getPermission, createPermission, updatePermission, fetchPermissions } from "../action/permissions";

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
  return useMutation<Permission, Error, {
    id: string;
    payload: UpdatePermissionPayload;
  }>({
    mutationFn: ({
      id,
      payload
    }) => updatePermission(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["permissions"]
      });
      queryClient.invalidateQueries({
        queryKey: ["roles"]
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