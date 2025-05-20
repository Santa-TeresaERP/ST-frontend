export interface RecipeProductResourceAttributes {
  id: string;
  product_id: string;
  quantity_required: string;
  unit: string; // Nuevo campo
  resource_id?: string; // Nuevo campo opcional
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RecipeAttributes {
  id: string;
  name: string;
  description: string;
  products: RecipeProductResourceAttributes[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateRecipePayload {
  name: string;
  description: string;
  products: RecipeProductResourceAttributes[];
}

export interface UpdateRecipePayload {
  name?: string;
  description?: string;
  products?: RecipeProductResourceAttributes[];
}