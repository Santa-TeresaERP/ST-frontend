import { z } from 'zod';

export const SaleSchema = z.object({
    id: z.string(),
    income_date: z.string(),
    store_id: z.string(),
    total_income: z.number(),
    observations: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type Sale = z.infer<typeof SaleSchema>;

export interface CreateSalePayload {
    income_date: string;
    store_id: string;
    total_income: number;
    observations?: string;
}

export interface UpdateSalePayload {
    income_date?: string;
    store_id?: string;
    total_income?: number;
    observations?: string;
}

// Mantenemos la interfaz original para compatibilidad
export interface salesAttributes {
    id?: string;
    income_date: string;
    store_id: string;
    total_income: number;
    observations?: string;
    createdAt?: Date;
    updatedAt?: Date;
}