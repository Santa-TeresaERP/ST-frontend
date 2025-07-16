import api from '@/core/config/client'
import { returnsAttributes } from '../types/returns'

// Obtener todas las devoluciones
export const fetchReturns = async (): Promise<returnsAttributes[]> => {
  const response = await api.get<returnsAttributes[]>('/returns')
  return response.data
}

// Obtener una devolución por ID
export const getReturn = async (id: string): Promise<returnsAttributes> => {
  const response = await api.get<returnsAttributes>(`/returns/${id}`)
  return response.data
}

// Crear una devolución
export const createReturn = async (payload: Omit<returnsAttributes, 'id' | 'createdAt' | 'updatedAt'>): Promise<returnsAttributes> => {
  const response = await api.post<returnsAttributes>('/returns', payload)
  return response.data
}

// Actualizar una devolución
export const updateReturn = async (
  id: string,
  payload: Partial<Omit<returnsAttributes, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<returnsAttributes> => {
  const response = await api.patch<returnsAttributes>(`/returns/${id}`, payload)
  return response.data
}

// Eliminar una devolución
export const deleteReturn = async (id: string): Promise<void> => {
  await api.delete(`/returns/${id}`)
}
