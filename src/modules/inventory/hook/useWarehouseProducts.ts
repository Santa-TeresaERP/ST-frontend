import {
  WarehouseProduct,
  CreateWarehouseProductPayload,
  UpdateWarehouseProductPayload,
} from '../types/product'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchWarehouseProducts,
  fetchWarehouseProductById,
  fetchWarehouseProductsByWarehouse,
  fetchWarehouseProductsByProduct,
  createWarehouseProduct,
  updateWarehouseProduct,
  deleteWarehouseProduct,
} from '../action/product'

export const useFetchWarehouseProducts = () =>
  useQuery<{ data: WarehouseProduct[] }, Error>({
    queryKey: ['warehouse-products'],
    queryFn: fetchWarehouseProducts,
  })

export const useFetchWarehouseProductById = (id: string) =>
  useQuery<{ data: WarehouseProduct }, Error>({
    queryKey: ['warehouse-products', id],
    queryFn: () => fetchWarehouseProductById(id),
    enabled: !!id,
  })

export const useFetchWarehouseProductsByWarehouse = (warehouseId: string) =>
  useQuery<{ data: WarehouseProduct[] }, Error>({
    queryKey: ['warehouse-products', 'warehouse', warehouseId],
    queryFn: () => fetchWarehouseProductsByWarehouse(warehouseId),
    enabled: !!warehouseId,
  })

export const useFetchWarehouseProductsByProduct = (productId: string) =>
  useQuery<{ data: WarehouseProduct[] }, Error>({
    queryKey: ['warehouse-products', 'product', productId],
    queryFn: () => fetchWarehouseProductsByProduct(productId),
    enabled: !!productId,
  })

export const useCreateWarehouseProduct = () => {
  const queryClient = useQueryClient()
  return useMutation<WarehouseProduct, Error, CreateWarehouseProductPayload>({
    mutationFn: createWarehouseProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['warehouse-products'] }),
  })
}

export const useUpdateWarehouseProduct = () => {
  const queryClient = useQueryClient()
  return useMutation<WarehouseProduct, Error, { id: string; payload: UpdateWarehouseProductPayload }>(
    {
      mutationFn: ({ id, payload }) => updateWarehouseProduct(id, payload),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['warehouse-products'] }),
    }
  )
}

export const useDeleteWarehouseProduct = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: deleteWarehouseProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['warehouse-products'] }),
  })
}

