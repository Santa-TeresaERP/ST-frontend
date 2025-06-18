import api from '@/core/config/client';
import { WarehouseProduct, CreateWarehouseProductPayload, UpdateWarehouseProductPayload } from '../types/warehouseProduct';

export const fetchWarehouseProducts = async (): Promise<WarehouseProduct[]> => {
    const response = await api.get('/warehouseProduct');
    return response.data.data; // <-- Así accedes al array real
}

export const createWarehouseProduct = async (payload: CreateWarehouseProductPayload): Promise<WarehouseProduct> => {
    const response = await api.post<WarehouseProduct>('/warehouseProduct', payload);
    return response.data;
}

export const updateWarehouseProduct = async (id: string, payload: UpdateWarehouseProductPayload): Promise<WarehouseProduct> => {
    const response = await api.patch<WarehouseProduct>(`/warehouseProduct/${id}`, payload);
    return response.data;
}

export const deleteWarehouseProduct = async (id: string): Promise<void> => {
    await api.delete(`/warehouseProduct/${id}`);
}