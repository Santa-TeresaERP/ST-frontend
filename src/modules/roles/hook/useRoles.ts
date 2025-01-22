import { CreateRolePayload, UpdateRolePayload, Role } from "../types/roles";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteRole, getRole, createRole, updateRole, fetchRoles } from "../action/role";

export const useFetchRoles = () => {
  return useQuery<Role[], Error>({
    queryKey: ["roles"],
    queryFn: fetchRoles
  });
};

export const useFetchRole = (id: string) => {
  return useQuery<Role, Error>({
    queryKey: ["role", id],
    queryFn: () => getRole(id)
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation<Role, Error, CreateRolePayload>({
    mutationFn: createRole,
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["roles"]
    })
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation<Role, Error, {
    id: string;
    payload: UpdateRolePayload;
  }>({
    mutationFn: ({
      id,
      payload
    }) => updateRole(id, payload),
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["roles"]
    })
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteRole,
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["roles"]
    })
  });
};

