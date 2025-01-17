import { zod } from 'zod';

export const ModuleSchema = zod.object({
    id: zod.string(),
    name: zod.string(),
    description: zod.string(),
    createdAt: zod.string().optional(),
    updatedAt: zod.string().optional(),
})

export type Module = zod.infer<typeof ModuleSchema>;

export interface UpdateModulePayload{
    name: string;
    description: string;
}