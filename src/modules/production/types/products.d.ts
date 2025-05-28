import { z } from 'zod';
import { RecipeProductResourceAttributes } from './recipes.d'; // Importa los tipos de recetas

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  category_id: z.string(),
  price: z.preprocess((val) => Number(val), z.number()), // Convertir a número si viene como string
  description: z.string().optional(), // Hacer opcional para coincidir con el backend
  imagen_url: z.string().optional(), // Hacer opcional para coincidir con el backend
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type Product = z.infer<typeof ProductSchema>;

export interface ProductWithRecipe extends Product {
  recipe?: RecipeProductResourceAttributes[];
}

export interface CreateProductPayload {
  name: string;
  category_id: string;
  price: number;
  description?: string; // Opcional para coincidir con el backend
  imagen_url?: string; // Opcional para coincidir con el backend
}

export interface UpdateProductPayload {
  name: string;
  category_id: string;
  price: number;
  description?: string; // Opcional para coincidir con el backend
  imagen_url?: string; // Opcional para coincidir con el backend
}