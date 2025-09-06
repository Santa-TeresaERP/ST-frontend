import { z } from 'zod';

/**
 * Schema para el formulario de CREACIÓN de un Gasto General.
 */
export const overheadFormSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es obligatorio.')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'El nombre solo puede contener letras.' }),
  
  date: z.string().min(1, 'La fecha es obligatoria.'),
  
  type: z.enum(
    ['monasterio', 'donativo', 'gasto mensual', 'otro ingreso', 'otro egreso'],
    { required_error: 'Debe seleccionar un tipo.' }
  ),
  
  // Usamos z.coerce.number() para convertir la entrada del formulario (string) a número
  amount: z.coerce.number({ invalid_type_error: 'El monto debe ser un número.' })
    .min(0.01, 'El monto debe ser mayor que cero.'),
    
  description: z.string().optional(),
});

/**
 * Schema para el formulario de EDICIÓN.
 * Es similar al de creación, pero omite el campo 'type' y hace todo lo demás opcional.
 */
export const updateOverheadFormSchema = overheadFormSchema.omit({ type: true }).partial();

export const generalOverheadFormsSchema = overheadFormSchema.extend({
  moduleName: z.string().optional(), // Nombre del
});


// Tipos inferidos para usar con react-hook-form
export type OverheadFormData = z.infer<typeof overheadFormSchema>;
export type UpdateOverheadFormData = z.infer<typeof updateOverheadFormSchema>;
export type GeneralOverheadFormData = z.infer<typeof generalOverheadFormsSchema>;