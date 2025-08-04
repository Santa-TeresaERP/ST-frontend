// Interfaz para el objeto Module que viene anidado
interface ModuleInfo {
  name: string;
}

/**
 * Representa la estructura de un Gasto General tal como lo devuelve la API.
 */
export interface GeneralExpense {
  id: string;
  module_id: string;
  expense_type: string;
  amount: number;
  date: string; // Las fechas en JSON llegan como strings
  description?: string | null;
  report_id?: string | null;
  createdAt: string;
  updatedAt: string;
  module: ModuleInfo; // Objeto de módulo anidado
}

/**
 * Define el payload para CREAR un nuevo registro de gasto.
 */
export interface CreateExpensePayload {
  module_id: string;
  expense_type: string;
  amount: number;
  date: string;
  description?: string;
}

/**
 * Define el payload para ACTUALIZAR un registro de gasto.
 * Usamos Partial para hacer todos los campos opcionales.
 */
export type UpdateExpensePayload = Partial<CreateExpensePayload>;