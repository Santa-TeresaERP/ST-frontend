// Verified Zod import path
import { z } from 'zod';

// Schema based on backend model src/models/resource.ts and ResourceAttributes
export const ResourceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  unit_price: z.string(), // Backend model uses STRING
  type_unit: z.string(),
  total_cost: z.number(), // Backend model uses FLOAT
  supplier_id: z.string().uuid().optional().nullable(), // Backend allows null
  observation: z.string().optional().nullable(), // Backend allows null
  purchase_date: z.string(), // Dates are typically strings over API, model uses DATE
  createdAt: z.string().datetime().optional(), // Backend adds timestamps
  updatedAt: z.string().datetime().optional().nullable(), // Backend adds timestamps
  // Define supplier schema if it needs to be nested and is fetched
  supplier: z.object({ 
      id: z.string().uuid(),
      name: z.string()
      // Add other relevant supplier fields if needed
  }).optional().nullable() // Assuming supplier might not always be present or fetched
});

// Infer the TypeScript type from the Zod schema
export type Resource = z.infer<typeof ResourceSchema>;

// Payload interface for creating a resource
// Matches fields required by backend serviceCreateResource.ts (likely)
export interface CreateResourcePayload {
  name: string;
  unit_price: string;
  type_unit: string;
  total_cost: number;
  supplier_id: string | null;
  observation: string | null;
  purchase_date: string;
}

// Payload interface for updating a resource
// Matches fields allowed by backend serviceUpdateResource.ts (likely partial update)
export interface UpdateResourcePayload {
  name: string;
  unit_price: string;
  type_unit: string;
  total_cost: number;
  supplier_id: string | null;
  observation: string | null;
  purchase_date: string;
}

