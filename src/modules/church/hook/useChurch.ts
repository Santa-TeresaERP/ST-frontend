import { CreateChurchPayload, UpdateChurchPayload, Church } from '@/modules/church/types/church'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteChurch, getChurch, updateChurch, createChurch, fetchChurches, fetchChurchesAll } from '../actions/church'
import { useModulePermission, MODULE_NAMES } from '@/core/utils/useModulesMap'

interface AxiosError extends Error {
  response?: {
    status: number
  }
}

export const useFetchChurches = () => {
  const { hasPermission: canView } = useModulePermission(MODULE_NAMES.CHURCH, 'canRead')

  return useQuery<Church[], Error>({
    queryKey: ['churches'],
    queryFn: fetchChurches,
    enabled: canView,
    retry: (failureCount, error: Error) => {
      const axiosError = error as AxiosError
      if (axiosError?.response?.status === 403) return false
      return failureCount < 3
    },
    staleTime: canView ? 5 * 60 * 1000 : 0,
  })
}

export const useFetchChurchesAll = () => {
  const { hasPermission: canView } = useModulePermission(MODULE_NAMES.CHURCH, 'canRead')

  return useQuery<Church[], Error>({
    queryKey: ['churches', 'all'],
    queryFn: fetchChurchesAll,
    enabled: canView,
    retry: (failureCount, error: Error) => {
      const axiosError = error as AxiosError
      if (axiosError?.response?.status === 403) return false
      return failureCount < 3
    },
  })
}

export const useFetchChurch = (id: string) => {
  const { hasPermission: canView } = useModulePermission(MODULE_NAMES.CHURCH, 'canRead')

  return useQuery<Church, Error>({
    queryKey: ['church', id],
    queryFn: () => getChurch(id),
    enabled: canView && !!id,
    retry: (failureCount, error: Error) => {
      const axiosError = error as AxiosError
      if (axiosError?.response?.status === 403) return false
      return failureCount < 3
    },
  })
}

export const useCreateChurch = () => {
  const queryClient = useQueryClient()
  const { hasPermission: canCreate } = useModulePermission(MODULE_NAMES.CHURCH, 'canWrite')

  return useMutation<Church, Error, CreateChurchPayload>({
    mutationFn: async (payload: CreateChurchPayload) => {
      if (!canCreate) throw { isPermissionError: true, silent: true }
      try {
        return await createChurch(payload)
      } catch (error: unknown) {
        const axiosError = error as AxiosError
        if (axiosError?.response?.status === 403) throw { isPermissionError: true, silent: true }
        throw error
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['churches'] }),
    retry: (failureCount, error: unknown) => {
      const errorObj = error as { isPermissionError?: boolean }
      if (errorObj?.isPermissionError) return false
      return failureCount < 3
    },
    retryDelay: 0,
  })
}

export const useUpdateChurch = () => {
  const queryClient = useQueryClient()
  const { hasPermission: canEdit } = useModulePermission(MODULE_NAMES.CHURCH, 'canEdit')

  return useMutation<Church, Error, { id: string; payload: UpdateChurchPayload }>({
    mutationFn: async ({ id, payload }) => {
      if (!canEdit) throw { isPermissionError: true, silent: true }
      try {
        return await updateChurch(id, payload)
      } catch (error: unknown) {
        const axiosError = error as AxiosError
        if (axiosError?.response?.status === 403) throw { isPermissionError: true, silent: true }
        throw error
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['churches'] }),
    retry: (failureCount, error: unknown) => {
      const errorObj = error as { isPermissionError?: boolean }
      if (errorObj?.isPermissionError) return false
      return failureCount < 3
    },
    retryDelay: 0,
  })
}

export const useDeleteChurch = () => {
  const queryClient = useQueryClient()
  const { hasPermission: canDelete } = useModulePermission(MODULE_NAMES.CHURCH, 'canDelete')

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      if (!canDelete) throw { isPermissionError: true, silent: true }
      try {
        return await deleteChurch(id)
      } catch (error: unknown) {
        const axiosError = error as AxiosError
        if (axiosError?.response?.status === 403) throw { isPermissionError: true, silent: true }
        throw error
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['churches'] }),
    retry: (failureCount, error: unknown) => {
      const errorObj = error as { isPermissionError?: boolean }
      if (errorObj?.isPermissionError) return false
      return failureCount < 3
    },
    retryDelay: 0,
  })
}
