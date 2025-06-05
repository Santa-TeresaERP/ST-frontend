import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchWarehouseResources,
  getWarehouseResource,
  createWarehouseResource,
  updateWarehouseResource,
  deleteWarehouseResource,
} from "../action/warehouseResource";
import { WarehouseResourceAttributes } from "../types/warehouseResource";

// Fetch all warehouse resources
export const useFetchWarehouseResources = () => {
  return useQuery<WarehouseResourceAttributes[], Error>({
    queryKey: ["warehouseResources"],
    queryFn: fetchWarehouseResources,
  });
};

// Fetch a single warehouse resource by ID
export const useFetchWarehouseResource = (id: string) => {
  return useQuery<WarehouseResourceAttributes, Error>({
    queryKey: ["warehouseResource", id],
    queryFn: () => getWarehouseResource(id),
  });
};

// Create a warehouse resource
export const useCreateWarehouseResource = () => {
  const queryClient = useQueryClient();
  return useMutation<WarehouseResourceAttributes, Error, Omit<WarehouseResourceAttributes, 'id'>>({
    mutationFn: createWarehouseResource,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["warehouseResources"],
      });
    },
  });
};

// Update a warehouse resource
export const useUpdateWarehouseResource = () => {
  const queryClient = useQueryClient();
  return useMutation<
    WarehouseResourceAttributes,
    Error,
    { id: string; payload: Partial<Omit<WarehouseResourceAttributes, 'id'>> }
  >({
    mutationFn: ({ id, payload }) => updateWarehouseResource(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["warehouseResources"],
      });
    },
  });
};

// Delete a warehouse resource
export const useDeleteWarehouseResource = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteWarehouseResource,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["warehouseResources"],
      });
    },
  });
};