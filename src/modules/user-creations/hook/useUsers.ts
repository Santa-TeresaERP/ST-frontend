import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, createUser, updateUser, deleteUser } from '../action/user';
import { UpdateUserPayload, CreateUserPayload, User } from '../types/user';
import { useUserStore } from '@/core/store/auth';

export const useUsers = () => {
  const { setUsers } = useUserStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    select: (data) => {
      setUsers(data);
      return data;
    },
  });

  const createUserMutation = useMutation<User, Error, CreateUserPayload>({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const updateUserMutation = useMutation<User, Error, { id: number; payload: UpdateUserPayload }>({
    mutationFn: ({ id, payload }) => updateUser(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const deleteUserMutation = useMutation<void, Error, number>({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  return {
    users: data,
    isLoading,
    createUser: createUserMutation.mutateAsync,
    updateUser: updateUserMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,
  };
};