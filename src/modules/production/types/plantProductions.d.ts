import { z } from 'zod';

export const PlantSchema = z.object({
  id: z.string(),
  plant_name: z.string(),
  address: z.string(),
  warehouse_id: z.string(), // Nuevo campo agregado
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Plant = z.infer<typeof PlantSchema>;

export interface CreatePlantPayload {
  plant_name: string;
  address: string;
  warehouse_id: string; // Nuevo campo agregado
}

export interface UpdatePlantPayload {
  plant_name?: string;
  address?: string;
  warehouse_id?: string; // Nuevo campo agregado
}