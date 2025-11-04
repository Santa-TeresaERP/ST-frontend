export interface MonasteryExpenses {
  id: string;
  category: string;
  amount: number;
  Name: string;
  date: string; // Las fechas de la API llegan como strings
  descripción: string;
  overheadsId?: string | null;
  createdAt: string;
  updatedAt: string;
  // Relación con overhead
  overhead?: {
    id: string;
    name: string;
    type: string;
    amount: number;
    description?: string;
    status: boolean;
  };
}

/**
 * Define el payload para CREAR un nuevo Gasto de Monasterio.
 */
export interface CreateMonasteryExpensePayload {
  category: string;
  amount: number;
  Name: string;
  date: string; // El input de fecha del navegador devuelve un string
  descripción: string;
  overheadsId?: string;
}

/**
 * Define el payload para ACTUALIZAR un Gasto de Monasterio.
 * Es parcial porque el usuario puede actualizar solo algunos campos.
 */
export type UpdateMonasteryExpensePayload = Partial<CreateMonasteryExpensePayload>;

/**
 * Response para cuando se obtienen gastos de monasterio con paginación
 */
export interface MonasteryExpenseResponse {
  data: MonasteryExpense[];
  total: number;
  page: number;
  limit: number;
}