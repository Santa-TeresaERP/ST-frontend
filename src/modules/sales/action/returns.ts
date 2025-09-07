import api from '@/core/config/client'
import { returnsAttributes } from '../types/returns'

// Normalizador para asegurar tipos consistentes
const normalizeReturn = (ret: returnsAttributes): returnsAttributes => {
  return {
    ...ret,
    price: Number(ret.price),
    createdAt: ret.createdAt ? new Date(ret.createdAt) : undefined,
    updatedAt: ret.updatedAt ? new Date(ret.updatedAt) : undefined,
  }
}

// Obtener todas las devoluciones
export const fetchReturns = async (): Promise<returnsAttributes[]> => {
  const response = await api.get<returnsAttributes[]>('/returns')
  return response.data.map(normalizeReturn)
}

// Obtener una devolución por ID
export const getReturn = async (id: string): Promise<returnsAttributes> => {
  const response = await api.get<returnsAttributes>(`/returns/${id}`)
  return normalizeReturn(response.data)
}

// Crear una devolución
export const createReturn = async (
  payload: Omit<returnsAttributes, 'id' | 'createdAt' | 'updatedAt'>
): Promise<returnsAttributes> => {
  const response = await api.post<returnsAttributes>('/returns', payload)
  return normalizeReturn(response.data)
}

// Actualizar una devolución
export const updateReturn = async (
  id: string,
  payload: Partial<Omit<returnsAttributes, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<returnsAttributes> => {
  const response = await api.patch<returnsAttributes>(`/returns/${id}`, payload)
  return normalizeReturn(response.data)
}

// Eliminar una devolución
export const deleteReturn = async (id: string): Promise<void> => {
  await api.delete(`/returns/${id}`)
}
