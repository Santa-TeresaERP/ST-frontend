import api from '@/core/config/client';
import { Rental, CreateRentalPayload, UpdateRentalPayload } from '../types/rentals';

export const fetchAllRentals = async (): Promise<Rental[]> => {
  const response = await api.get<Rental[]>('/rentals');
  return response.data;
};

export const fetchRentalById = async (id: string): Promise<Rental> => {
  const response = await api.get<Rental>(`/rentals/${id}`);
  return response.data;
};

export const createRental = async (payload: CreateRentalPayload): Promise<Rental> => {
  console.log('📤 Enviando datos al backend:', payload);
  
  // ✅ Validaciones según especificaciones del backend
  const validations = {
    customer_id: {
      value: payload.customer_id,
      isString: typeof payload.customer_id === 'string',
      isNotEmpty: payload.customer_id.length > 0,
      isUUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.customer_id)
    },
    place_id: {
      value: payload.place_id,
      isString: typeof payload.place_id === 'string',
      isNotEmpty: payload.place_id.length > 0,
      isUUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.place_id)
    },
    user_id: {
      value: payload.user_id,
      isString: typeof payload.user_id === 'string',
      isNotEmpty: payload.user_id.length > 0,
      isUUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.user_id)
    },
    start_date: {
      value: payload.start_date,
      isDate: payload.start_date instanceof Date,
      isValid: !isNaN(payload.start_date.getTime())
    },
    end_date: {
      value: payload.end_date,
      isDate: payload.end_date instanceof Date,
      isValid: !isNaN(payload.end_date.getTime())
    },
    amount: {
      value: payload.amount,
      isNumber: typeof payload.amount === 'number',
      isPositive: payload.amount > 0
    }
  };

  console.log('🔍 Validaciones del payload:', validations);

  // ✅ Identificar errores específicos
  const errors = [];
  if (!validations.customer_id.isUUID) errors.push(`customer_id "${payload.customer_id}" no es un UUID válido`);
  if (!validations.place_id.isUUID) errors.push(`place_id "${payload.place_id}" no es un UUID válido`);
  if (!validations.user_id.isUUID) errors.push(`user_id "${payload.user_id}" no es un UUID válido`);
  if (!validations.start_date.isValid) errors.push('start_date no es una fecha válida');
  if (!validations.end_date.isValid) errors.push('end_date no es una fecha válida');
  if (!validations.amount.isPositive) errors.push(`amount ${payload.amount} debe ser positivo`);

  if (errors.length > 0) {
    console.error('❌ Errores de validación:', errors);
    throw new Error(`Errores de validación: ${errors.join(', ')}`);
  }

  console.log('📤 Estructura detallada:', {
    customer_id: payload.customer_id,
    place_id: payload.place_id,
    user_id: payload.user_id,
    start_date: payload.start_date,
    start_date_iso: payload.start_date.toISOString(),
    end_date: payload.end_date,
    end_date_iso: payload.end_date.toISOString(),
    amount: payload.amount
  });
  
  try {
    // ✅ Convertir fechas a formato ISO string (formato esperado por el backend)
    const backendPayload = {
      customer_id: payload.customer_id,
      place_id: payload.place_id,
      user_id: payload.user_id,
      start_date: payload.start_date.toISOString(), // "2025-08-05T14:00:00.000Z"
      end_date: payload.end_date.toISOString(),     // "2025-08-08T18:00:00.000Z"
      amount: payload.amount
    };
    
    console.log('📤 Payload transformado para backend:', backendPayload);
    
    const response = await api.post<Rental>('/rentals', backendPayload);
    console.log('✅ Respuesta del backend:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error del backend:', {
      status: (error as any).response?.status,
      statusText: (error as any).response?.statusText,
      data: (error as any).response?.data,
      message: (error as any).message,
      payload: payload
    });
    throw error;
  }
};

export const updateRental = async (id: string, payload: UpdateRentalPayload): Promise<Rental> => {
  const response = await api.patch<Rental>(`/rentals/${id}`, payload);
  return response.data;
};

export const deleteRental = async (id: string): Promise<void> => {
  await api.put(`/rentals/${id}`);
};
