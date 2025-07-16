import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchReturns,
  getReturn,
  createReturn,
  updateReturn,
  deleteReturn,
} from '../action/returns'
import { returnsAttributes } from '../types/returns'

// Obtener todas las devoluciones
export const useFetchReturns = () => {
  return useQuery<returnsAttributes[], Error>({
    queryKey: ['returns'],
    queryFn: fetchReturns,
  })
}

// Obtener una devolución por ID
export const useFetchReturn = (id: string) => {
  return useQuery<returnsAttributes, Error>({
    queryKey: ['return', id],
    queryFn: () => getReturn(id),
    enabled: !!id,
  })
}

// Crear una devolución
export const useCreateReturn = () => {
  const queryClient = useQueryClient()
  return useMutation<returnsAttributes, Error, Omit<returnsAttributes, 'id' | 'createdAt' | 'updatedAt'>>({
    mutationFn: createReturn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['returns'] })
    },
  })
}

// Actualizar una devolución
export const useUpdateReturn = () => {
  const queryClient = useQueryClient()
  return useMutation<returnsAttributes, Error, { id: string; payload: Partial<Omit<returnsAttributes, 'id' | 'createdAt' | 'updatedAt'>> }>({
    mutationFn: ({ id, payload }) => updateReturn(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['returns'] })
    },
  })
}

// Eliminar una devolución
export const useDeleteReturn = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: deleteReturn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['returns'] })
    },
  })
}
