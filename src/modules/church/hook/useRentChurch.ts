import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchRentChurches,
  fetchRentChurchById,
  createRentChurch,
  updateRentChurch,
  deleteRentChurch,
} from '../actions/rentChurch';
import { CreateRentChurchPayload, RentChurch, UpdateRentChurchPayload } from '../types/rentChurch';


// ✅ Obtener todas las reservas de iglesia
export const useFetchRentChurches = () => {
  return useQuery<RentChurch[], Error>({
    queryKey: ['rentChurches'],
    queryFn: fetchRentChurches,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

// ✅ Obtener una reserva de iglesia por ID
export const useFetchRentChurchById = (id: string | null) => {
  return useQuery<RentChurch | null, Error>({
    queryKey: ['rentChurch', id],
    queryFn: () => (id ? fetchRentChurchById(id) : Promise.resolve(null)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// ✅ Crear una nueva reserva de iglesia
export const useCreateRentChurch = () => {
  const queryClient = useQueryClient();

  return useMutation<RentChurch, Error, CreateRentChurchPayload>({
    mutationFn: createRentChurch,
    onSuccess: () => {
      // Invalidar la query para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['rentChurches'] });
    },
    onError: (error) => {
      console.error('❌ Error creando reserva de iglesia:', error);
    },
  });
};

// ✅ Actualizar una reserva de iglesia existente
export const useUpdateRentChurch = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RentChurch,
    Error,
    { id: string; payload: UpdateRentChurchPayload }
  >({
    mutationFn: ({ id, payload }) => updateRentChurch(id, payload),
    onSuccess: (_, variables) => {
      // Invalidar la lista y la query específica
      queryClient.invalidateQueries({ queryKey: ['rentChurches'] });
      queryClient.invalidateQueries({ queryKey: ['rentChurch', variables.id] });
    },
    onError: (error) => {
      console.error('❌ Error actualizando reserva de iglesia:', error);
    },
  });
};

// ✅ Eliminar (soft delete) una reserva de iglesia
export const useDeleteRentChurch = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteRentChurch,
    onSuccess: (_, id) => {
      // Invalidar la lista y la query específica
      queryClient.invalidateQueries({ queryKey: ['rentChurches'] });
      queryClient.invalidateQueries({ queryKey: ['rentChurch', id] });
    },
    onError: (error) => {
      console.error('❌ Error eliminando reserva de iglesia:', error);
    },
  });
};
