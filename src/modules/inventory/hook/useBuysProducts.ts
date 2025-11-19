import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { 
  BuysProductWithRelations,
  CreateBuysProductPayload, 
  UpdateBuysProductPayload,
  BuysProductResponse
} from '../types/buysProduct.d';
import {
  fetchBuysProducts,
  fetchAllBuysProducts,
  getBuysProduct,
  createBuysProduct,
  updateBuysProduct,
  deleteBuysProduct,
  reactivateBuysProduct,
} from '../action/buysProduct';

// 🔹 HOOK PARA OBTENER TODAS LAS COMPRAS ACTIVAS
export const useFetchBuysProducts = () => {
  return useQuery<BuysProductWithRelations[], Error>({
    queryKey: ['buysProducts'],
    queryFn: fetchBuysProducts,
  });
};

// 🔹 HOOK PARA OBTENER TODAS LAS COMPRAS (incluye inactivas)
export const useFetchAllBuysProducts = () => {
  return useQuery<BuysProductWithRelations[], Error>({
    queryKey: ['allBuysProducts'],
    queryFn: fetchAllBuysProducts,
  });
};

// 🔹 HOOK PARA OBTENER UNA COMPRA POR ID
export const useFetchBuysProduct = (id: string) => {
  return useQuery<BuysProductWithRelations, Error>({
    queryKey: ['buysProduct', id],
    queryFn: () => getBuysProduct(id),
    enabled: !!id,
  });
};

// 🔹 HOOK PARA CREAR COMPRA DE PRODUCTO
export const useCreateBuysProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<BuysProductResponse, Error, CreateBuysProductPayload>({
    mutationFn: createBuysProduct,
    onSuccess: () => {
      // Invalidar ambas queries
      queryClient.invalidateQueries({ queryKey: ['buysProducts'] });
      queryClient.invalidateQueries({ queryKey: ['allBuysProducts'] });
      // También invalidar productos de almacén ya que se crea movimiento
      queryClient.invalidateQueries({ queryKey: ['warehouseProducts'] });
    },
  });
};

// 🔹 HOOK PARA ACTUALIZAR COMPRA DE PRODUCTO
export const useUpdateBuysProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<BuysProductWithRelations, Error, { id: string; payload: UpdateBuysProductPayload }>({
    mutationFn: ({ id, payload }) => updateBuysProduct(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['buysProducts'] });
      queryClient.invalidateQueries({ queryKey: ['allBuysProducts'] });
      queryClient.invalidateQueries({ queryKey: ['buysProduct', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['warehouseProducts'] });
    },
  });
};

// 🔹 HOOK PARA ELIMINAR (SOFT DELETE)
export const useDeleteBuysProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteBuysProduct,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['buysProducts'] });
      queryClient.invalidateQueries({ queryKey: ['allBuysProducts'] });
      queryClient.removeQueries({ queryKey: ['buysProduct', id] });
    },
  });
};

// 🔹 HOOK PARA REACTIVAR
export const useReactivateBuysProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: reactivateBuysProduct,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['buysProducts'] });
      queryClient.invalidateQueries({ queryKey: ['allBuysProducts'] });
      queryClient.invalidateQueries({ queryKey: ['buysProduct', id] });
    },
  });
};
