import { z } from 'zod';

export const PlantSchema = z.object({
  id: z.string(),
  plant_name: z.string(),
  address: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Plant = z.infer<typeof PlantSchema>;

export interface CreatePlantPayload {
  plant_name: string;
  address: string;
}

export interface UpdatePlantPayload {
  plant_name?: string;
  address?: string;
}