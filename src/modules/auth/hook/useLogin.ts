import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/core/store/auth';
import { login } from '../actions/login';
import { LoginCredentials, LoginResponse } from '../types/loginactionside';

export const useAdminLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const mutation = useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: login,
    onSuccess: (data) => {
      setUser(data.user);
    },
  });

  return {
    loginFn: mutation.mutateAsync,
    isPending: mutation.status === 'pending'
  };
};