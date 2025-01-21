
import api from '@/core/config/client';
import { User, CreateUserPayload, UpdateUserPayload } from '../types/user';

export const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>('/users');
  return response.data;
};

export const getUser = async (id: string): Promise<User> => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};

export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const response = await api.post<User>('/users', payload);
  return response.data;
};

export const updateUser = async (id: string, payload: UpdateUserPayload): Promise<User> => {
  const response = await api.patch<User>(`/users/${id}`, payload);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.put(`/users/${id}`);
};
