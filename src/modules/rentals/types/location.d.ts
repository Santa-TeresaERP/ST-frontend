// locationSchema.d.ts
import { z } from "zod";

export declare const LocationSchema: z.ZodObject<{
  id: z.ZodString;
  name: z.ZodString;
  address: z.ZodString;
  capacity: z.ZodNumber;
  status: z.ZodString;
  createdAt: z.ZodOptional<z.ZodString>;
  updatedAt: z.ZodOptional<z.ZodString>;
}>;

export type Location = z.infer<typeof LocationSchema>;

export interface CreateLocationPayload {
  name: string;
  address: string;
  capacity: number;
  status: string;
}

export interface UpdateLocationPayload {
  name?: string;
  address?: string;
  capacity?: number;
  status?: string;
}
