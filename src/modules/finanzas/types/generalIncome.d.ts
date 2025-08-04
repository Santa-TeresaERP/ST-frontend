// Interfaz para el objeto Module que viene anidado
interface ModuleInfo {
  name: string;
}

/**
 * Representa la estructura de un Ingreso General tal como lo devuelve la API.
 */
export interface GeneralIncome {
  id: string;
  module_id: string;
  income_type: string;
  amount: number;
  date: string; // Las fechas en JSON llegan como strings
  description?: string | null;
  report_id?: string | null;
  createdAt: string;
  updatedAt: string;
  module: ModuleInfo; // Objeto de módulo anidado
}

/**
 * Define el payload para CREAR un nuevo registro de ingreso.
 */
export interface CreateIncomePayload {
  module_id: string;
  income_type: string;
  amount: number;
  date: string;
  description?: string;
}

/**
 * Define el payload para ACTUALIZAR un registro de ingreso.
 * Usamos Partial para hacer todos los campos opcionales.
 */
export type UpdateIncomePayload = Partial<CreateIncomePayload>;