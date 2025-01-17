import { UpdateModulePayload, Module } from "../types/modules";
import {  fetchModules, getModule, updateModules } from "../action/module";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchModules = () => {
  return useQuery<Module[], Error>({
    queryKey: ["modules"],
    queryFn: fetchModules
  });
};

export const useFetchModule = (id: string) => {
  return useQuery<Module, Error>({
    queryKey: ["module", id],
    queryFn: () => getModule(id)
  });
};

export const useUpdateModule = () => {
  const queryClient = useQueryClient();
  return useMutation<Module, Error, {
    id: string;
    payload: UpdateModulePayload;
  }>({
    mutationFn: ({
      id,
      payload
    }) => updateModules(id, payload),
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["modules"]
    })
  });
};
