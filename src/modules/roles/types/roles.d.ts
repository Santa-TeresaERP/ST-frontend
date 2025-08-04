
import { zod } from 'zod';

export const RoleSchema = zod.object({
    id: zod.string(),
    name: zod.string(),
    description: zod.string(),
    createdAt: zod.string().optional(),
    updatedAt: zod.string().optional(),
})

export type Role = zod.infer<typeof RoleSchema>;

// 🆕 NUEVO: Tipo extendido que incluye permisos del backend
export interface RoleWithPermissions extends Role {
    Permissions?: {
        id: string;
        moduleId: string;
        canRead: boolean;
        canWrite: boolean;
        canEdit: boolean; // Campo del backend
        canDelete: boolean;
        Module?: {
            id: string;
            name: string;
        };
    }[];
}

export interface CreateRolePayload {
    name: string;
    description: string;
}

export interface UpdateRolePayload {
    name: string;
    description: string;
}