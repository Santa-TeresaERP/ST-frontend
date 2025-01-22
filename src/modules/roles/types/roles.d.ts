
import { zod } from 'zod';

export const RoleSchema = zod.object({
    id: zod.string(),
    name: zod.string(),
    description: zod.string(),
    createdAt: zod.string().optional(),
    updatedAt: zod.string().optional(),
})

export type Role = zod.infer<typeof RoleSchema>;

export interface CreateRolePayload {
    name: string;
    description: string;
}

export interface UpdateRolePayload {
    name: string;
    description: string;
}