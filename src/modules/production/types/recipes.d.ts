export interface RecipeProductResourceAttributes {
    product_id: string;
    quantity_required: string;
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