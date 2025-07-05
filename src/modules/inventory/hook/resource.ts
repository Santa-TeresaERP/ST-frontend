// Verified import path for react-query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BuysResourceAttributes,
  CreateBuysResourcePayload,
  UpdateBuysResourcePayload,
} from '../types/buysResource';
import {
  fetchResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
} from '../action/resource';

// Hook to fetch all resources
export const useFetchResources = () => {
  return useQuery<BuysResourceAttributes[], Error>({
    queryKey: ['resources'],
    queryFn: fetchResources,
  });
};

// Hook to fetch a single resource by ID
export const useFetchResource = (id: string) => {
  return useQuery<BuysResourceAttributes, Error>({
    queryKey: ['resource', id],
    queryFn: () => getResource(id),
    enabled: !!id, // Only fetch if id is provided
  });
};

// Hook for creating a resource
export const useCreateResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBuysResourcePayload) => createResource(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
};

// Hook for updating a resource
export const useUpdateResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBuysResourcePayload }) =>
      updateResource(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
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

