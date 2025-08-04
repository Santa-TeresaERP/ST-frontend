import api from '@/core/config/client'
import { returnsAttributes } from '../types/returns'

// Obtener todas las devoluciones
export const fetchReturns = async (): Promise<returnsAttributes[]> => {
  const response = await api.get<{ success: boolean; data: returnsAttributes[] }>('/returns')

  if (!response.data.success) {
    throw new Error('No se pudieron obtener las devoluciones')
  }

  return response.data.data
}

// Obtener una devolución por ID
export const getReturn = async (id: string): Promise<returnsAttributes> => {
  const response = await api.get<{ success: boolean; data: returnsAttributes }>(`/returns/${id}`)

  if (!response.data.success) {
    throw new Error('No se pudo obtener la devolución')
  }

  return response.data.data
}

// Crear una devolución
export const createReturn = async (
  payload: Omit<
    returnsAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'price'
  >,
): Promise<returnsAttributes> => {
  const response = await api.post<{ success: boolean; data: returnsAttributes }>(
    '/returns',
    payload,
  )

  if (!response.data.success) {
    throw new Error('No se pudo crear la devolución')
  }

  return response.data.data
}

// Actualizar una devolución
export const updateReturn = async (
  id: string,
  payload: Partial<
    Omit<returnsAttributes, 'id' | 'createdAt' | 'updatedAt' | 'price'>
  >,
): Promise<returnsAttributes> => {
  const response = await api.patch<{ success: boolean; data: returnsAttributes }>(
    `/returns/${id}`,
    payload,
  )

  if (!response.data.success) {
    throw new Error('No se pudo actualizar la devolución')
  }

  return response.data.data
}

// Eliminar una devolución
export const deleteReturn = async (id: string): Promise<void> => {
  const response = await api.delete<{ success: boolean; message: string }>(
    `/returns/${id}`,
  )

  if (!response.data.success) {
    throw new Error('No se pudo eliminar la devolución')
  }
}
