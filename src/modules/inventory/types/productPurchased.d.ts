export interface ProductPurchased {
  id: string;
  name: string;
  description: string | null;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Define la forma de los datos necesarios para crear un nuevo Producto Comprado.
 * Esto es lo que el formulario de creación enviará.
 */
export interface CreateProductPurchasedPayload {
  name: string;
  description?: string;
}

/**
 * Define la forma de los datos para actualizar un Producto Comprado.
 * Es 'Partial' porque se pueden actualizar solo algunos campos.
 */
export type UpdateProductPurchasedPayload = Partial<CreateProductPurchasedPayload>;