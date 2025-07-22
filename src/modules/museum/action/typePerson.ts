import api from '@/core/config/client';
import { TypePerson } from '../types/typePerson';

const BASE_URL = '/type_person';

export const getTypePersons = async (): Promise<TypePerson[]> => {
  const res = await api.get<TypePerson[]>(BASE_URL);
  return res.data;
};

export const getTypePerson = async (id: string): Promise<TypePerson> => {
  const res = await api.get<TypePerson>(`${BASE_URL}/${id}`);
  return res.data;
};

export const createTypePerson = async (data: Omit<TypePerson, 'id'>): Promise<TypePerson> => {
  const res = await api.post<TypePerson>(BASE_URL, data);
  return res.data;
};

export const updateTypePerson = async (id: string, data: Partial<TypePerson>): Promise<TypePerson> => {
  const res = await api.patch<TypePerson>(`${BASE_URL}/${id}`, data);
  return res.data;
};

export const deleteTypePerson = async (id: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`);
}; 