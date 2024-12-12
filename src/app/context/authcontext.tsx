"use client";
import React, { createContext, useContext, useState, ReactNode, FC } from 'react';
import api from '@/app/api/client';
import { User } from '@/app/lib/interfaces';
import { Modules, ModuleKeys } from '@/app/lib/interfaces';

export interface ApiContextProps {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<User>;
  deleteUser: (identifier: string | number) => Promise<void>;
  getUsers: () => Promise<User[]>;
  updateUser: (userId: number, userData: Partial<User>) => Promise<User>;
  modules: Modules;
  handleModuleChange: (module: ModuleKeys, permission: keyof Modules[ModuleKeys]) => void;
}

export const AuthContext = createContext<ApiContextProps | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const [modules, setModules] = useState<Modules>({
    administrativo: { usersgroups: false },
    ventas: {  misa: false, reposteria: false, manualidades: false},
    alquileres: { santaCatalina: false, goyoneche: false, santaMarta: false },
  });

  const handleModuleChange = (module: ModuleKeys, permission: keyof Modules[ModuleKeys]) => {
    setModules((prevModules) => ({
      ...prevModules,
      [module]: {
        ...prevModules[module],
        [permission]: !prevModules[module][permission],
      },
    }));
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      setUser(response.data.user);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };


  const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const deleteUser = async (identifier: string | number): Promise<void> => {
    try {
      await api.delete(`/users/${identifier}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const getUsers = async (): Promise<User[]> => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  const updateUser = async (userId: number, userData: Partial<User>): Promise<User> => {
    try {
      const response = await api.patch(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, createUser, deleteUser, getUsers, updateUser, modules, handleModuleChange }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
