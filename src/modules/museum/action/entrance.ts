import api from '@/core/config/client';
import { Entrance, EntrancePayload } from '../types/entrance';

const BASE_URL = '/entrance';

export const getEntrances = async (): Promise<Entrance[]> => {
  const res = await api.get<Entrance[]>(BASE_URL);
  return res.data;
};

export const getEntrance = async (id: string): Promise<Entrance> => {
  const res = await api.get<Entrance>(`${BASE_URL}/${id}`);
  return res.data;
};

export const createEntrance = async (data: EntrancePayload): Promise<Entrance> => {
  const res = await api.post<Entrance>(BASE_URL, data);
  return res.data;
};

export const updateEntrance = async (id: string, data: Partial<EntrancePayload>): Promise<Entrance> => {
  const res = await api.patch<Entrance>(`${BASE_URL}/${id}`, data);
  return res.data;
};

export const deleteEntrance = async (id: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`);
}; 