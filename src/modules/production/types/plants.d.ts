import { z } from 'zod';

// Esquema para Plant (Planta)
export const PlantSchema = z.object({
  id: z.string().uuid().optional(),
  plant_name: z.string().min(1, "El nombre de la planta es requerido"),
  address: z.string().min(1, "La dirección es requerida"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Tipo inferido para Plant
export type Plant = z.infer<typeof PlantSchema>;

// Payloads para operaciones CRUD de Plant
export interface CreatePlantPayload {
  plant_name: string;
  address: string;
}

export interface UpdatePlantPayload {
  plant_name?: string;
  address?: string;
}