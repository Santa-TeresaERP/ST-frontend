// Verified Zod import path
import { z } from 'zod';

// Schema based on backend model src/models/resource.ts and ResourceAttributes
export const ResourceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  observation: z.string().optional().nullable(), // Backend allows null
  status: z.boolean().optional(), // Backend adds status
  createdAt: z.string().datetime().optional(), // Backend adds timestamps
  updatedAt: z.string().datetime().optional().nullable(), // Backend adds timestamps
});

// Infer the TypeScript type from the Zod schema
export type Resource = z.infer<typeof ResourceSchema>;

// Payload interface for creating a resource
// Matches fields required by backend serviceCreateResource.ts (likely)
export interface CreateResourcePayload {
  name: string;
  observation: string | null;
}

// Payload interface for updating a resource
// Matches fields allowed by backend serviceUpdateResource.ts (likely partial update)
export interface UpdateResourcePayload {
  name: string;
  observation: string | null;
}

