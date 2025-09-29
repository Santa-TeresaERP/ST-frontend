export interface Overhead {
  id: string;
  name: string;
  date: string; // Las fechas de la API llegan como strings
  type: 'monasterio' | 'donativo' | 'gasto mensual' | 'otro ingreso' | 'otro egreso';
  amount: number;
  description?: string | null;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  // Relación con gastos del monasterio
  monasteryExpenses?: import('./monasteryexpense.d').MonasteryExpense[];
}

/**
 * Define el payload para CREAR un nuevo Gasto General.
 * 'status' es gestionado por el backend, así que lo omitimos.
 */
export interface CreateOverheadPayload {
  name: string;
  date: string; // El input de fecha del navegador devuelve un string
  type: 'monasterio' | 'donativo' | 'gasto mensual' | 'otro ingreso' | 'otro egreso';
  amount: number;
  description?: string;
  moduleName?: string; // Nombre del módulo desde donde se crea el gasto
}

/**
 * Define el payload para ACTUALIZAR un Gasto General.
 * Es parcial porque el usuario puede actualizar solo algunos campos.
 */
export type UpdateOverheadPayload = Partial<Omit<CreateOverheadPayload, 'type'>>;

/**
 * Overhead con relaciones incluidas
 */
export interface OverheadWithRelations extends Overhead {
  monasteryExpenses?: import('./monasteryexpense.d').MonasteryExpense[];
}

/**
 * Response types para APIs que incluyen relaciones
 */
export interface OverheadApiResponse extends Overhead {
  monasteryExpenses?: import('./monasteryexpense.d').MonasteryExpense[];
}