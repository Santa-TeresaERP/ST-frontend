import { Production } from "../types/productions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProductions, deleteProduction, createProduction, updateProduction, } from "../action/production";

export const useFetchProductions = () => {
  return useQuery<Production[], Error>({
    queryKey: ["production"],
    queryFn: fetchProductions
  });
};

export const useCreateProduction = () => {
  const queryClient = useQueryClient();
  return useMutation<Production, Error, Production>({
    mutationFn: createProduction,
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["production"]
    })
  });
};

export const useUpdateProduction = () => {
  const queryClient = useQueryClient();
  return useMutation<Production, Error, {
    id: string;
    payload: Production;
  }>({
    mutationFn: ({
      id,
      payload
    }) => updateProduction(id, payload),
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["production"]
    })
  });
};

export const useDeleteProduction = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteProduction,
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["production"]
    })
  });
};