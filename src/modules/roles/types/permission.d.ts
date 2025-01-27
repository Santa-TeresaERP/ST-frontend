import { zod } from 'zod';

export const PermissionSchema = zod.object({
    id: zod.string(),
    moduleId: zod.string(),
    canRead: zod.boolean(),
    canWrite: zod.boolean(),
    canUpdate: zod.boolean(),
    canDelete: zod.boolean(),
    createdAt: zod.string().optional(),
    updatedAt: zod.string().optional(),
})

export type Permission = zod.infer<typeof PermissionSchema>;

export interface CreatePermissionPayload {
    moduleId: string;
    canRead: boolean;
    canWrite: boolean;
    canUpdate: boolean;
    canDelete: boolean;
}

export interface UpdatePermissionPayload {
    permissions: {
      moduleId: string;
      canRead: boolean;
      canWrite: boolean;
      canUpdate: boolean;
      canDelete: boolean;
    }[];
  }
