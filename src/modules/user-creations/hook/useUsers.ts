import { CreateUserPayload, UpdateUserPayload, User } from '@/modules/user-creations/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteUser, getUser, updateUser, createUser } from '../action/user';
import { fetchUsers } from '@/modules/user-creations/action/user';

export const useFetchUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};

export const useFetchUser = (id: string) => {
  return useQuery<User, Error>({
    queryKey: ['user', id],
    queryFn: () => getUser(id),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, CreateUserPayload>({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, { id: string; payload: UpdateUserPayload }>({
    mutationFn: ({ id, payload }) => updateUser(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};
