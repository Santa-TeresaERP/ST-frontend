import { zod } from 'zod';

export const ProductSchema = zod.object({
    id: zod.string(),
    name: zod.string(),
    category_id: zod.string(),
    price: zod.number(),
    stock: zod.number(),
    description: zod.string(),
    imagen_url: zod.string(),
    created_at: zod.string().optional(),
    updated_at: zod.string().optional(),
});

export type Product = zod.infer<typeof ProductSchema>;

export interface CreateProductPayload {
    name: string;
    category_id: string;
    price: number;
    stock: number;
    description: string;
    imagen_url: string;
}

export interface UpdateProductPayload {
    name: string;
    category_id: string;
    price: number;
    stock: number;
    description: string;
    imagen_url: string;
}