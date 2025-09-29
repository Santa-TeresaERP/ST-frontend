export interface MonasteryExpense {
  id: string;
  category: string;
  amount: number;
  Name: string;
  date: string; // Las fechas de la API llegan como strings
  descripción: string;
  overheadsId?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Define el payload para CREAR un nuevo Gasto del Monasterio.
 */
export interface CreateMonasteryExpensePayload {
  category: string;
  amount: number;
  Name: string;
  date: string; // El input de fecha del navegador devuelve un string
  descripción: string;
  overheadsId: string; // REQUERIDO: Debe asociarse a un overhead
}

/**
 * Define el payload para ACTUALIZAR un Gasto del Monasterio.
 * Es parcial porque el usuario puede actualizar solo algunos campos.
 */
export type UpdateMonasteryExpensePayload = Partial<CreateMonasteryExpensePayload>;

/**
 * Tipos relacionados con las relaciones
 */
export interface MonasteryExpenseWithOverhead extends MonasteryExpense {
  overhead?: {
    id: string;
    name: string;
    type: string;
    amount: number;
    date: string;
    description?: string;
    status: boolean;
  };
}