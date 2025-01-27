// src/modules/auth/hook/useAuth.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthToken } from '@/modules/auth/hook/useLogin';

export const useAuth = () => {
  const { token, isLoaded } = useAuthToken();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !token) {
      router.replace('/');
    }
  }, [isLoaded, token, router]);

  return {
    isAuthenticated: !!token,
    isLoading: !isLoaded,
    token
  };
};