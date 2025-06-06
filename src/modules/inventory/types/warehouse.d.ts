import { z } from 'zod';

// Esquema de validación para almacenes
export const WarehouseSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre es obligatorio').max(100, 'El nombre no debe exceder los 100 caracteres'),
  location: z.string().min(1, 'La ubicación es obligatoria').max(150, 'La ubicación no debe exceder los 150 caracteres'),
  capacity: z.number().int('La capacidad debe ser un número entero').nonnegative('La capacidad no puede ser negativa'),
  observation: z.string().max(150, 'La observación no debe exceder los 150 caracteres').optional(),
});

// Inferir el tipo a partir del esquema
export type WarehouseAttributes = z.infer<typeof WarehouseSchema>;

// Payload para crear un almacén
export interface CreateWarehousePayload {
  name: string;
  location: string;
  capacity: number;
  observation?: string;
}

// Payload para actualizar un almacén
export interface UpdateWarehousePayload {
  name?: string;
  location?: string;
  capacity?: number;
  observation?: string;
}