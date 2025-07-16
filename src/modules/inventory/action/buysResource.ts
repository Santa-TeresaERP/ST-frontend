import api from '@/core/config/client';
import type { BuysResourceAttributes, BuysResourceWithResource, CreateBuysResourcePayload, UpdateBuysResourcePayload } from '../types/buysResource.d';

export const fetchBuysResourceAttributes = async (): Promise<BuysResourceWithResource[]> =>{
    const res = await api.get('/buysResource');
    return res.data
}

export const CreateBuysResource = async (payload: CreateBuysResourcePayload): Promise<BuysResourceAttributes> => {
    const res = await api.post('/buysResource', payload);
    return res.data;
}

export const UpdateBuysResource = async (id: string, payload: UpdateBuysResourcePayload): Promise<BuysResourceAttributes> => {
    const res = await api.patch(`/buysResource/${id}`, payload);
    return res.data;
}

export const DeleteBuysResource = async (id: string): Promise<void> => {
    await api.delete(`/buysResource/${id}`);
}
