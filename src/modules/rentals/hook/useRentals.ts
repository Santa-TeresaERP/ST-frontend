import { Rental, CreateRentalPayload, UpdateRentalPayload } from '../types/rentals';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchAllRentals, 
  fetchRentalById, 
  createRental, 
  updateRental, 
  deleteRental 
} from '../action/rentals';

export const useFetchAllRentals = () => {
  return useQuery<Rental[], Error>({
    queryKey: ['rentals'],
    queryFn: fetchAllRentals,
  });
};

export const useFetchRentalById = (id: string) => {
  return useQuery<Rental, Error>({
    queryKey: ['rentals', id],
    queryFn: () => fetchRentalById(id),
    enabled: !!id,
  });
};

export const useCreateRental = () => {
  const queryClient = useQueryClient();
  return useMutation<Rental, Error, CreateRentalPayload>({
    mutationFn: createRental,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rentals'] }),
  });
};

export const useUpdateRental = () => {
  const queryClient = useQueryClient();
  return useMutation<Rental, Error, { id: string; payload: UpdateRentalPayload }>({
    mutationFn: ({ id, payload }) => updateRental(id, payload),
    onSuccess: () => {
      console.log("Mutation successful, invalidating queries...");
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
    },
    onError: (error) => {
      console.error("Error updating rental:", error);
    },
  });
};

export const useDeleteRental = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteRental,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rentals'] }),
  });
};
