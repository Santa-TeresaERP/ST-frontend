import { Resource, CreateResourcePayload, UpdateResourcePayload } from '../types/resource';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchResources, createResource, updateResource, deleteResource } from '../action/resources';

export const useFetchResources = () => {
  return useQuery<Resource[], Error>({
    queryKey: ['resources'],
    queryFn: fetchResources,
  });
};

export const useCreateResource = () => {
  const queryClient = useQueryClient();
  return useMutation<Resource, Error, CreateResourcePayload>({
    mutationFn: createResource,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resources'] }),
  });
};

export const useUpdateResource = () => {
  const queryClient = useQueryClient();
  return useMutation<Resource, Error, { id: string; payload: UpdateResourcePayload }>({
    mutationFn: ({ id, payload }) => updateResource(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resources'] }),
  });
};

export const useDeleteResource = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteResource,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resources'] }),
  });
};

