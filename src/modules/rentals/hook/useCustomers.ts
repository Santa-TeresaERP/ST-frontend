import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCustomers, createCustomer, updateCustomer, deleteCustomer, searchCustomers } from '../action/customers';
import { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '../types/customer';

// Hook para obtener todos los customers
export const useFetchCustomers = () => {
  return useQuery<Customer[], Error>({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para buscar customers
export const useSearchCustomers = (query: string) => {
  return useQuery<Customer[], Error>({
    queryKey: ['customers', 'search', query],
    queryFn: () => searchCustomers(query),
    enabled: query.length > 0, // Solo buscar si hay query
    staleTime: 30 * 1000, // 30 segundos
  });
};

// Hook para crear customer
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Customer, Error, CreateCustomerRequest>({
    mutationFn: createCustomer,
    onSuccess: () => {
      // Invalidar y refrescar la lista de customers
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

// Hook para actualizar customer
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Customer, Error, { id: string; data: UpdateCustomerRequest }>({
    mutationFn: ({ id, data }) => updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

// Hook para eliminar customer
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};
