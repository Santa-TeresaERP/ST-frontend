export interface MonasteryExpense {
  id: string;
  category: string;
  amount: number;
  Name: string;
  date: Date;
  descripción: string;
  overheadsId: string;
}

/**
 * Define el payload para CREAR un nuevo Gasto del Monasterio.
 */
export interface CreateMonasteryExpensePayload {
  category: string;
  amount: number;
  Name: string;
  date: Date;
  descripción: string;
  overheadsId?: string;
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