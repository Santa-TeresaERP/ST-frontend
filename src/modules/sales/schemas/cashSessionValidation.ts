import { z } from 'zod';

export const cashSessionSchema = z.object({
  store_id: z
    .string()
    .uuid('El ID de la tienda debe ser un UUID válido'),
  start_amount: z
    .number()
    .nonnegative('El monto inicial no puede ser negativo')
    .min(0, 'El monto inicial debe ser mayor o igual a 0'),
  end_amount: z
    .number()
    .nonnegative('El monto final no puede ser negativo')
    .optional(),
  total_sales: z
    .number()
    .nonnegative('El total de ventas no puede ser negativo')
    .optional(),
  total_returns: z
    .number()
    .nonnegative('El total de devoluciones no puede ser negativo')
    .optional(),
  started_at: z
    .string()
    .datetime('La fecha de inicio debe ser una fecha válida')
    .optional(),
  ended_at: z
    .string()
    .datetime('La fecha de término debe ser una fecha válida')
    .optional(),
  status: z
    .enum(['open', 'closed'], {
      invalid_type_error: 'El estado debe ser "open" o "closed"',
    })
    .optional(),
});

// Schema para crear una nueva sesión de caja
export const createCashSessionSchema = z.object({
  store_id: z
    .string()
    .uuid('El ID de la tienda debe ser un UUID válido'),
  start_amount: z
    .number()
    .nonnegative('El monto inicial no puede ser negativo')
    .min(0, 'El monto inicial debe ser mayor o igual a 0'),
});

// Schema para cerrar una sesión de caja
export const closeCashSessionSchema = z.object({
  end_amount: z
    .number()
    .nonnegative('El monto final no puede ser negativo'),
  total_sales: z
    .number()
    .nonnegative('El total de ventas no puede ser negativo')
    .optional(),
  total_returns: z
    .number()
    .nonnegative('El total de devoluciones no puede ser negativo')
    .default(0),
  ended_at: z
    .string()
    .datetime('La fecha de término debe ser una fecha válida')
    .optional(),
  status: z
    .literal('closed')
    .default('closed'),
});

// Schema para actualizar una sesión de caja (campos opcionales)
export const updateCashSessionSchema = cashSessionSchema.partial();

// Validación de que el monto final sea mayor o igual al inicial menos las devoluciones
export const validateCashSessionClosure = (data: {
  start_amount: number;
  end_amount: number;
  total_sales?: number;
  total_returns: number;
}) => {
  if (data.end_amount < 0) {
    return { success: false, message: 'El monto final no puede ser negativo' };
  }
  if (data.total_returns > data.start_amount) {
    return { success: false, message: 'Las devoluciones no pueden ser mayores al monto inicial' };
  }
  return { success: true, message: 'Validación exitosa' };
};
