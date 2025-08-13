import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchPlaces,
  createPlace,
  updatePlace,
  deletePlace
} from '../action/places'; // Asegúrate de que esta ruta sea correcta
import {
  Place,
  CreatePlacePayload,
  UpdatePlacePayload
} from '../types/places.d';

// ✅ Obtener todos los places
export const useFetchPlaces = () => {
  return useQuery<Place[], Error>({
    queryKey: ['places'],
    queryFn: () => fetchPlaces(), // Llamar sin parámetros para obtener todos
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// ✅ Obtener places filtrados por location_id (usando cache si es posible)
export const useFetchPlacesByLocation = (
  locationId: string | null,
  forceRefetchKey?: number
) => {
  const { data: allPlaces = [], isLoading: allPlacesLoading } = useFetchPlaces();

  return useQuery<Place[], Error>({
    queryKey: ['places', 'filtered', locationId, forceRefetchKey],
    queryFn: () => {
      if (!locationId) return Promise.resolve([]);
      
      // Si tenemos datos en cache y es un array, filtrar localmente
      if (Array.isArray(allPlaces) && allPlaces.length > 0) {
        const filtered = allPlaces.filter(
          (place: Place) => place.location_id === locationId
        );
        return Promise.resolve(filtered);
      }

      // Si no hay datos en cache, hacer petición directa al servidor
      return fetchPlaces(locationId);
    },
    enabled: !!locationId && !allPlacesLoading,
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
  });
};

// ✅ Crear place
export const useCreatePlace = () => {
  const queryClient = useQueryClient();

  return useMutation<Place, Error, CreatePlacePayload>({
    mutationFn: createPlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] });
    },
    onError: (error) => {
      console.error('❌ Error creando place:', error);
    },
  });
};

// ✅ Actualizar place
export const useUpdatePlace = () => {
  const queryClient = useQueryClient();

  return useMutation<Place, Error, { id: string; payload: UpdatePlacePayload }>({
    mutationFn: ({ id, payload }) => updatePlace(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] });
    },
    onError: (error) => {
      console.error('❌ Error actualizando place:', error);
    },
  });
};

// ✅ Eliminar place
export const useDeletePlace = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deletePlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] });
    },
    onError: (error) => {
      console.error('❌ Error eliminando place:', error);
    },
  });
};
