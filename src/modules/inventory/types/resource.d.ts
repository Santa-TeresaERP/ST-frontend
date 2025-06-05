import { z } from 'zod';


export const ResourceSchema = z.object({
    id: z.string(),
    name: z.string(),
    unit_price: z.number(),
    type_unit: z.string(),
    total_cost: z.number(),
    suppliert_id: z.string().optional(),
    observation: z.string().optional(),
    purchase_date: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type Resource = z.infer<typeof ResourceSchema>;

export interface CreateResourcePayload {
    name: string;
    unit_price: number;
    type_unit: string;
    total_cost: number;
    suppliert_id?: string;
    observation?: string;
    purchase_date?: string;
}

export interface UpdateResourcePayload {
    name?: string;
    unit_price?: number;
    type_unit?: string;
    total_cost?: number;
    suppliert_id?: string;
    observation?: string;
    purchase_date?: string;
}