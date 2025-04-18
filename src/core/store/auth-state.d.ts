import { User } from '@/modules/user-creations/types/user';

export type AuthState = {
    user: User | null;
    token: string | null;
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    logout: () => void;
  };

  
