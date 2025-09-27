import { z } from 'zod';

export const LocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  capacity: z.string(),
  status: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Location = z.infer<typeof LocationSchema>;

export interface CreateLocationPayload {
  name: string;
  address: string;
  capacity: string;
  status: string;
}

export interface UpdateLocationPayload {
  name?: string;
  address?: string;
  capacity?: string;
  status?: string;
}
