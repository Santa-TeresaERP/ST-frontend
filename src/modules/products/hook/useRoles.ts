
import { createRole, deleteRole, fetchRoles, updateRole } from "@/modules/roles/action/role";
import { CreateRolePayload, Role, UpdateRolePayload } from "@/modules/roles/types/roles";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useFetchRoles = () => {
    return useQuery<Role[], Error>({
        queryKey: ['roles'],
        queryFn: fetchRoles
    });
};

export const useCreateRole = () => {
    const queryClient = useQueryClient();
    return useMutation<Role, Error, CreateRolePayload>({
        mutationFn: createRole,
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: ['roles']
        })
    });
};

export const useUpdateRole = () => {
    const queryClient = useQueryClient();
    return useMutation<Role, Error, { id: string; payload: UpdateRolePayload }>({
        mutationFn: ({ id, payload }) => updateRole(id, payload),
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: ['roles']
        })
    });
};

export const useDeleteRole = () => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, string>({
        mutationFn: deleteRole,
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: ['roles']
        })
    });
};

