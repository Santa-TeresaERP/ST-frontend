import { z } from 'zod';

export const CashSessionSchema = z.object({
    id: z.string(),
    user_id: z.string(),
    store_id: z.string(),
    start_amount: z.union([z.number(), z.string()]).transform(val => Number(val)),
    end_amount: z.union([z.number(), z.string()]).transform(val => Number(val)).optional(),
    total_sales: z.union([z.number(), z.string()]).transform(val => Number(val)).optional(),
    total_returns: z.union([z.number(), z.string()]).transform(val => Number(val)).optional(),
    started_at: z.string(),
    ended_at: z.string().optional(),
    status: z.enum(['open', 'closed']),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type CashSession = z.infer<typeof CashSessionSchema>;

export interface CreateCashSessionPayload {
    store_id: string;
    start_amount: number;
}

export interface UpdateCashSessionPayload {
    end_amount?: number;
    total_sales?: number;
    total_returns?: number;
    ended_at?: string;
    status?: 'open' | 'closed';
}

export interface CloseCashSessionPayload {
    end_amount: number;
    total_sales?: number;
    total_returns: number;
    ended_at: string;
    status: 'closed';
}

// Interfaz principal para compatibilidad
export interface CashSessionAttributes {
    id?: string;
    user_id: string;
    store_id: string;
    start_amount: number | string;
    end_amount?: number | string;
    total_sales?: number | string;
    total_returns?: number | string;
    started_at: Date | string;
    ended_at?: Date | string;
    status: 'open' | 'closed';
    createdAt?: Date;
    updatedAt?: Date;
}
