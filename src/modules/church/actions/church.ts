import api from '@/core/config/client'
import { Church, CreateChurchPayload, UpdateChurchPayload } from '@/modules/church/types/church'

export const fetchChurches = async (): Promise<Church[]> => {
  const response = await api.get<Church[]>('/church')
  return response.data
}

export const getChurch = async (id: string): Promise<Church> => {
  const response = await api.get<Church>(`/church/${id}`)
  return response.data
}

export const createChurch = async (payload: CreateChurchPayload): Promise<Church> => {
  const response = await api.post<Church>('/church', payload)
  return response.data
}

export const updateChurch = async (id: string, payload: UpdateChurchPayload): Promise<Church> => {
  const response = await api.patch<Church>(`/church/${id}`, payload)
  return response.data
}

export const deleteChurch = async (id: string): Promise<void> => {
  await api.put(`/church/${id}`)
}

export const fetchChurchesAll = async (): Promise<Church[]> => {
  const response = await api.get<Church[]>('/church/all')
  return response.data
}
