import { User } from '../models/admin/admin-schema';

export type AuthState = {
    user: User | null;
    token: string | null;
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    logout: () => void;
  };

  
