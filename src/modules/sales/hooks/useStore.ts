import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchStores, fetchStoreById, createStore, updateStore, deleteStore, searchStores } from '../action/store';
import { CreateStoreRequest, UpdateStoreRequest, StoreAttributes, StoreResponse } from '../types/store.d';

const STORE_QUERY_KEY = 'stores';

// Hook para obtener todas las tiendas con paginación
export const useFetchStores = (page: number = 1, limit: number = 10) => {
  return useQuery<StoreResponse, Error>({
    queryKey: [STORE_QUERY_KEY, page, limit],
    queryFn: () => fetchStores(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obtener una tienda por ID
export const useFetchStoreById = (id: string) => {
  return useQuery<StoreAttributes, Error>({
    queryKey: [STORE_QUERY_KEY, id],
    queryFn: () => fetchStoreById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para crear una tienda
export const useCreateStore = () => {
  const queryClient = useQueryClient();

  return useMutation<StoreAttributes, Error, CreateStoreRequest>({
    mutationFn: createStore,
    onSuccess: () => {
      console.log('Tienda creada exitosamente, invalidando consultas...');
      // Invalidar todas las consultas de stores
      queryClient.invalidateQueries({ queryKey: [STORE_QUERY_KEY] });
      // Refrescar específicamente la primera página
      queryClient.refetchQueries({ queryKey: [STORE_QUERY_KEY, 1, 10] });
    },
    onError: (error) => {
      console.error('Error al crear tienda:', error);
    }
  });
};

// Hook para actualizar una tienda
export const useUpdateStore = () => {
  const queryClient = useQueryClient();

  return useMutation<StoreAttributes, Error, UpdateStoreRequest>({
    mutationFn: updateStore,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [STORE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [STORE_QUERY_KEY, data.id] });
    },
  });
};

// Hook para eliminar una tienda
export const useDeleteStore = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STORE_QUERY_KEY] });
    },
  });
};

// Hook para buscar tiendas
export const useSearchStores = (query: string) => {
  return useQuery<StoreAttributes[], Error>({
    queryKey: [STORE_QUERY_KEY, 'search', query],
    queryFn: () => searchStores(query),
    enabled: !!query && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};
