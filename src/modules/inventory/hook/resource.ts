// Verified import path for react-query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// Verified import paths for types and actions (assuming correct relative path)
import { Resource, CreateResourcePayload, UpdateResourcePayload } from '../types/resource';
import { fetchResources, getResource, createResource, updateResource, deleteResource } from '../action/resource';

// Hook to fetch all resources
export const useFetchResources = () => {
  return useQuery<Resource[], Error>({
    queryKey: ['resources'],
    queryFn: fetchResources,
  });
};

// Hook to fetch a single resource by ID
export const useFetchResource = (id: string) => {
  return useQuery<Resource, Error>({
    queryKey: ['resource', id],
    queryFn: () => getResource(id),
    enabled: !!id, // Only fetch if id is provided
  });
};

// Hook for creating a resource
export const useCreateResource = () => {
  const queryClient = useQueryClient();
  return useMutation<Resource, Error, CreateResourcePayload>({
    mutationFn: createResource,
    onSuccess: () => {
      // Invalidate queries to refetch data after creation
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
    // onError: (error) => { /* Optional: Handle error globally or display notification */ }
  });
};

// Hook for updating a resource
export const useUpdateResource = () => {
  const queryClient = useQueryClient();
  return useMutation<Resource, Error, { id: string; payload: UpdateResourcePayload }>({
    mutationFn: ({ id, payload }) => updateResource(id, payload),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries after update
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['resource', variables.id] });
    },
    // onError: (error, variables) => { /* Optional: Handle error */ }
  });
};

// Hook for deleting a resource
export const useDeleteResource = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteResource,
    onSuccess: (data, id) => {
      // Invalidate list query and remove specific resource query from cache
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.removeQueries({ queryKey: ['resource', id] });
    },
    // onError: (error, id) => { /* Optional: Handle error */ }
  });
};

