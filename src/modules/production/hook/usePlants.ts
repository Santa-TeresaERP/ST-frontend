import { Plant, CreatePlantPayload, UpdatePlantPayload } from '../types/plantProductions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPlants, createPlant, updatePlant, deletePlant } from '../action/plantProductions';

export const useFetchPlants = () => {
  return useQuery<Plant[], Error>({
    queryKey: ['plants'],
    queryFn: fetchPlants,
  });
};

export const useCreatePlant = () => {
  const queryClient = useQueryClient();
  return useMutation<Plant, Error, CreatePlantPayload>({
    mutationFn: createPlant,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plants'] }),
  });
};

export const useUpdatePlant = () => {
  const queryClient = useQueryClient();
  return useMutation<Plant, Error, { id: string; payload: UpdatePlantPayload }>({
    mutationFn: ({ id, payload }) => updatePlant(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plants'] }),
  });
};

export const useDeletePlant = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deletePlant,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plants'] }),
  });
};