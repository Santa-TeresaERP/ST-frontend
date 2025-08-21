import { create } from 'zustand';
import { User } from '@/modules/user-creations/types/user';
import { UserWithPermissions } from '@/core/utils/permission-types';

interface AuthState {
  user: User | null;
  userWithPermissions: UserWithPermissions | null;
  setUser: (user: User | null) => void;
  setUserWithPermissions: (user: UserWithPermissions | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userWithPermissions: null,
  setUser: (user) => set({ user }),
  setUserWithPermissions: (userWithPermissions) => set({ userWithPermissions }),
  logout: () => {
    // 🔥 LIMPIAR COMPLETAMENTE AL HACER LOGOUT
    localStorage.removeItem('authToken');
    set({ user: null, userWithPermissions: null });
    console.log('🔓 Logout completo - Token y estado limpiados');
  },
}));

interface UserState {
  users: User[];
  setUsers: (users: User[]) => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
}));
