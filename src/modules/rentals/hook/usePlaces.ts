import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPlaces, fetchPlace, createPlace, updatePlace, deletePlace } from '../action/places';
import { Place } from '../types/places';

export const useFetchPlaces = () => {
  return useQuery<Place[], Error>({
    queryKey: ['places'],
    queryFn: fetchPlaces,
  });
};

export const useFetchPlace = (id: string) => {
  return useQuery<Place, Error>({
    queryKey: ['places', id],
    queryFn: () => fetchPlace(id),
    enabled: !!id,
  });
};

export const useCreatePlace = () => {
  const queryClient = useQueryClient();
  return useMutation<Place, Error, Omit<Place, '_id'>>({
    mutationFn: createPlace,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['places'] }),
  });
};

export const useUpdatePlace = () => {
  const queryClient = useQueryClient();
  return useMutation<Place, Error, { id: string; payload: Partial<Place> }>({
    mutationFn: ({ id, payload }) => updatePlace(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['places'] }),
  });
};

export const useDeletePlace = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deletePlace,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['places'] }),
  });
};
