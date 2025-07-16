import { z } from 'zod';

export const SalesDetailsSchema = z.object({
    id: z.string(),
    saleId: z.string(),
    productId: z.string(),
    quantity: z.number(),
    mount: z.number(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type SalesDetails = z.infer<typeof SalesDetailsSchema>;

export interface CreateSalesDetailsPayload {
    saleId: string;
    productId: string;
    quantity: number;
    mount: number;
}

export interface UpdateSalesDetailsPayload {
    saleId?: string;
    productId?: string;
    quantity?: number;
    mount?: number;
}

// Mantenemos la interfaz original para compatibilidad
export interface salesItemsAttributes {
    id?: string;
    saleId: string;
    productId: string;
    quantity: number;
    mount: number;
    createdAt?: Date;
    updatedAt?: Date;
}