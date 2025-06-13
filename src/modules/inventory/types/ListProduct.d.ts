export interface ProductAttributes {
  id: string;
  name: string;
  category_id: string;
  price: number;
  description: string;
  imagen_url?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductPayload {
  name: string;
  category_id: string;
  price: number;
  description: string;
  image?: File; // imagen a subir
}

export interface UpdateProductPayload {
  name?: string;
  category_id?: string;
  price?: number;
  description?: string;
  image?: File; // imagen opcional en edición
}
