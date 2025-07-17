import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchStores,
  fetchStoreById,
  createStore,
  updateStore,
  deleteStore
} from "../action/store-actions";
import { 
  StoreAttributes,
  CreateStorePayload,
  UpdateStorePayload
} from "../types/store";

// Query keys
export const STORE_QUERY_KEYS = {
  all: ['stores'] as const,
  lists: () => [...STORE_QUERY_KEYS.all, 'list'] as const,
  list: (filters: string) => [...STORE_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...STORE_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...STORE_QUERY_KEYS.details(), id] as const,
};

// Hook para obtener todas las tiendas
export const useFetchStores = () => {
  return useQuery({
    queryKey: STORE_QUERY_KEYS.lists(),
    queryFn: async () => {
      console.log('🔍 Fetching stores...');
      const result = await fetchStores();
      console.log('📊 Stores fetched:', result);
      return result;
    },
    staleTime: 0, // Los datos son considerados obsoletos inmediatamente
    gcTime: 5 * 60 * 1000, // 5 minutos en cache
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: (failureCount, error) => {
      console.log('🔄 Retry attempt:', failureCount, error);
      return failureCount < 3;
    },
  });
};

// Hook para obtener tienda por ID
export const useFetchStoreById = (id: string) => {
  return useQuery({
    queryKey: STORE_QUERY_KEYS.detail(id),
    queryFn: () => fetchStoreById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para crear tienda
export const useCreateStore = () => {
  const queryClient = useQueryClient();
  
  return useMutation<StoreAttributes, Error, CreateStorePayload>({
    mutationFn: createStore,
    onSuccess: () => {
      // Invalidar todas las queries relacionadas con stores
      queryClient.invalidateQueries({ queryKey: STORE_QUERY_KEYS.all });
      // Refetch inmediato para asegurar datos actualizados
      queryClient.refetchQueries({ queryKey: STORE_QUERY_KEYS.lists() });
    },
  });
};

// Hook para actualizar tienda
export const useUpdateStore = () => {
  const queryClient = useQueryClient();
  
  return useMutation<StoreAttributes, Error, UpdateStorePayload>({
    mutationFn: updateStore,
    onSuccess: () => {
      // Invalidar todas las queries relacionadas con stores
      queryClient.invalidateQueries({ queryKey: STORE_QUERY_KEYS.all });
      // Refetch para asegurar datos actualizados
      queryClient.refetchQueries({ queryKey: STORE_QUERY_KEYS.lists() });
    },
  });
};

// Hook para eliminar tienda
export const useDeleteStore = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: deleteStore,
    onSuccess: () => {
      // Invalidar todas las queries relacionadas con stores
      queryClient.invalidateQueries({ queryKey: STORE_QUERY_KEYS.all });
      // Refetch para asegurar datos actualizados
      queryClient.refetchQueries({ queryKey: STORE_QUERY_KEYS.lists() });
    },
  });
};
