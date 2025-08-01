import { Location } from "../types/location";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchLocations,
  getLocation,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../action/locationActions";

export const useFetchLocations = () => {
  return useQuery<Location[], Error>({
    queryKey: ["locations"],
    queryFn: fetchLocations,
  });
};

export const useFetchLocation = (id: string) => {
  return useQuery<Location, Error>({
    queryKey: ["location", id],
    queryFn: () => getLocation(id),
  });
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation<Location, Error, Omit<Location, "id">>({
    mutationFn: createLocation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["locations"] }),
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Location,
    Error,
    { id: string; payload: Partial<Location> }
  >({
    mutationFn: ({ id, payload }) => updateLocation(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["locations"] }),
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteLocation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["locations"] }),
  });
};
