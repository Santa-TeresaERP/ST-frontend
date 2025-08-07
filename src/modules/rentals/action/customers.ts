import api from '@/core/config/client';
import { Customer, CreateCustomerRequest, UpdateCustomerRequest, CustomerResponse } from '../types/customer';

// Obtener todos los customers
export const fetchCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await api.get<CustomerResponse>('/customer');
    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.warn('API /customers no disponible, devolviendo array vacío');
    return [];
  }
};

// Crear un nuevo customer
export const createCustomer = async (customerData: CreateCustomerRequest): Promise<Customer> => {
  const response = await api.post<CustomerResponse>('/customer', customerData);
  if (response.data.success && response.data.data && !Array.isArray(response.data.data)) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'Error creating customer');
};

// Actualizar un customer
export const updateCustomer = async (id: string, customerData: UpdateCustomerRequest): Promise<Customer> => {
  try {
    const response = await api.put<CustomerResponse>(`/customer/${id}`, customerData);
    if (response.data.success && response.data.data && !Array.isArray(response.data.data)) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Error updating customer');
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

// Eliminar un customer
export const deleteCustomer = async (id: string): Promise<void> => {
  try {
    const response = await api.delete<CustomerResponse>(`/customer/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error deleting customer');
    }
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

// Buscar customers por nombre
export const searchCustomers = async (query: string): Promise<Customer[]> => {
  try {
    const response = await api.get<CustomerResponse>(`/customer/search?q=${encodeURIComponent(query)}`);
    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error searching customers:', error);
    return [];
  }
};
