import { z } from 'zod';

export const ProductionSchema = z.object({
    production_id: z.string(),
    productId: z.string(),
    quantityProduced: z.number(),
    productionDate: z.string(),
    observation: z.string(),
    plant_id: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type Production = z.infer<typeof ProductionSchema>;

export interface CreateProductionPayload {
    productId: string;
    quantityProduced: number;
    productionDate: string;
    observation: string;
    plant_id: string;
}

export interface UpdateProductionPayload {
    productId: string;
    quantityProduced: number;
    productionDate: string;
    observation: string;
    plant_id: string;
}
