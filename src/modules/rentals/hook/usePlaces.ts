import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Place } from '../types';
import { fetchPlaces, fetchPlacesByLocation, createPlace, updatePlace, deletePlace } from '../action/placeActions';

// Hook básico para obtener todos los places
export const useFetchPlaces = () => {
  return useQuery<Place[], Error>({
    queryKey: ['places'],
    queryFn: fetchPlaces,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000,   // 10 minutos
  });
};

// Hook optimizado para obtener places por location_id (CON FILTRO EN FRONTEND)
export const useFetchPlacesByLocation = (locationId: string | null, forceRefetchKey?: number) => {
  // Primero obtenemos todos los places
  const { data: allPlaces = [], isLoading: allPlacesLoading } = useFetchPlaces();

  return useQuery<Place[], Error>({
    queryKey: ['places', 'filtered', locationId, forceRefetchKey],
    queryFn: () => {
      if (!locationId) {
        return Promise.resolve([]);
      }
      
      if (!allPlaces || allPlaces.length === 0) {
        return fetchPlacesByLocation(locationId);
      }

      // Filtrar en frontend usando los datos que ya tenemos
      const filtered = allPlaces.filter(place => {
        return place.location_id === locationId;
      });

      return Promise.resolve(filtered);
    },
    enabled: !!locationId && !allPlacesLoading,
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 2 * 60 * 1000, // 2 minutos
  });
};

// Hook para crear place
export const useCreatePlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlace,
    onSuccess: () => {
      // Invalidar todas las queries relacionadas con places
      queryClient.invalidateQueries({ queryKey: ['places'] });
    },
    onError: (error) => {
      console.error('❌ Error creating place:', error);
    },
  });
};

// Hook para actualizar place
export const useUpdatePlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Place> }) => updatePlace(id, data),
    onSuccess: () => {
      // Invalidar todas las queries relacionadas con places
      queryClient.invalidateQueries({ queryKey: ['places'] });
    },
    onError: (error) => {
      console.error('❌ Error updating place:', error);
    },
  });
};

// Hook para eliminar place
export const useDeletePlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePlace,
    onSuccess: () => {
      // Invalidar todas las queries relacionadas con places
      queryClient.invalidateQueries({ queryKey: ['places'] });
    },
    onError: (error) => {
      console.error('❌ Error deleting place:', error);
    },
  });
};
