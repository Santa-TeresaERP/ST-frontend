import { zod } from 'zod';

export const CategorieSchema = zod.object({
    id: zod.string(),
    name: zod.string(),
    description: zod.string(),
    created_at: zod.string(),
    updated_at: zod.string(),
});

export type Categorie = zod.infer<typeof CategorieSchema>;

export interface CreateCategoriePayload {
    name: string;
    description: string;
}

export interface UpdateCategoriePayload {
    name: string;
    description: string;
}