// Verified import path for react-query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Resource,
  CreateResourcePayload,
  UpdateResourcePayload,
} from '../types/resource';
import { 
  BuysResourceWithResource,  
  CreateBuysResourcePayload, 
  UpdateBuysResourcePayload 
} from '../types/buysResource.d';
import {
  fetchResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
} from '../action/resource';
import { 
  fetchBuysResourceAttributes, 
  CreateBuysResource, 
  UpdateBuysResource, 
  DeleteBuysResource 
} from '../action/buysResource';

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

// Hook to fetch BuysResource with associated Resource data
export const useFetchResourcesWithBuys = () => {
  return useQuery<BuysResourceWithResource[], Error>({
    queryKey: ['buysResourcesWithResource'],
    queryFn: fetchBuysResourceAttributes,
  });
};

// Hook for creating a resource
export const useCreateResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateResourcePayload) => createResource(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
};

// Hook for updating a resource
export const useUpdateResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateResourcePayload }) =>
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

// Hook for creating a BuysResource
export const useCreateBuysResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBuysResourcePayload) => CreateBuysResource(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buysResourcesWithResource'] });
    },
  });
};

// Hook for updating a BuysResource
export const useUpdateBuysResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBuysResourcePayload }) =>
      UpdateBuysResource(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buysResourcesWithResource'] });
    },
  });
};

// Hook for deleting a BuysResource
export const useDeleteBuysResource = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: DeleteBuysResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buysResourcesWithResource'] });
    },
  });
};

