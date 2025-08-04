import api from '@/core/config/client';
import { CashSessionAttributes, CreateCashSessionPayload, UpdateCashSessionPayload, CloseCashSessionPayload } from '../types/cash-session';

// Interfaces para respuestas del backend
interface CashSessionResponse {
  message: string;
  cashSessions: CashSessionAttributes[];
}

interface SingleCashSessionResponse {
  message: string;
  cashSession: CashSessionAttributes;
}

// Interface para los detalles de la sesión de caja con totales calculados
interface CashSessionDetailsResponse {
  sessionId: string;
  storeId: string;
  startDate: string;
  endDate: string | null;
  initialMoney: string;
  totalSales: number;
  totalReturns: number;
  finalAmount: number;
  salesCount: number;
  returnsCount: number;
}

// Interface para la respuesta de verificación de sesión activa de una tienda
interface StoreActiveSessionResponse {
  success: boolean;
  isActive: boolean;
  message: string;
  store: {
    id: string;
    store_name: string;
    address: string;
  };
  activeSession?: {
    id: string;
    user_id: string;
    start_amount: number;
    started_at: string;
    status: string;
  };
  lastClosedSession?: {
    id: string;
    end_amount: number;
    ended_at: string;
    total_sales: number;
    total_returns: number;
  } | null;
  error?: string;
}

export const fetchCashSessions = async (): Promise<CashSessionAttributes[]> => {
  const response = await api.get<CashSessionResponse>('/cash_session');
  return response.data.cashSessions || [];
};

export const fetchCashSession = async (id: string): Promise<CashSessionAttributes> => {
  const response = await api.get<SingleCashSessionResponse>(`/cash_session/${id}`);
  return response.data.cashSession;
};

// Obtener detalles completos de una sesión de caja con totales calculados
export const fetchCashSessionDetails = async (id: string): Promise<CashSessionDetailsResponse> => {
  const response = await api.get<CashSessionDetailsResponse>(`/cash_session/${id}/details`);
  return response.data;
};

export const createCashSession = async (
  payload: CreateCashSessionPayload,
): Promise<CashSessionAttributes> => {
  const response = await api.post<SingleCashSessionResponse>('/cash_session', payload);
  return response.data.cashSession;
};

export const updateCashSession = async (
  id: string, 
  payload: UpdateCashSessionPayload
): Promise<CashSessionAttributes> => {
  const response = await api.patch<SingleCashSessionResponse>(`/cash_session/${id}`, payload);
  return response.data.cashSession;
};

export const closeCashSession = async (
  id: string,
  payload: CloseCashSessionPayload
): Promise<CashSessionAttributes> => {
  const closePayload = {
    ...payload,
    ended_at: payload.ended_at || new Date().toISOString(),
    status: 'closed' as const
  };
  
  const response = await api.patch<SingleCashSessionResponse>(`/cash_session/${id}`, closePayload);
  return response.data.cashSession;
};

export const deleteCashSession = async (id: string): Promise<void> => {
  await api.delete(`/cash_session/${id}`);
};

// Función auxiliar para obtener la sesión activa de una tienda
export const fetchActiveCashSession = async (storeId: string): Promise<CashSessionAttributes | null> => {
  try {
    console.log('🔍 [DEBUG] Fetching active cash session for store:', storeId);
    const response = await api.get<CashSessionResponse>(`/cash_session?store_id=${storeId}&status=open`);
    const sessions = response.data.cashSessions || [];
    
    console.log('🔍 [DEBUG] Response from backend:', {
      storeId,
      sessionsCount: sessions.length,
      sessions: sessions.map(s => ({
        id: s.id,
        store_id: s.store_id,
        status: s.status
      }))
    });
    
    // ✅ CORREGIDO: Filtro adicional para asegurar que la sesión pertenece a la tienda
    const validSession = sessions.find(session => session.store_id === storeId);
    
    if (validSession) {
      console.log('✅ [DEBUG] Valid session found:', {
        id: validSession.id,
        store_id: validSession.store_id,
        status: validSession.status
      });
      return validSession;
    } else {
      console.log('❌ [DEBUG] No valid session found for store:', storeId);
      return null;
    }
  } catch (error) {
    console.error('❌ [DEBUG] Error fetching active cash session:', error);
    return null;
  }
};

// Función auxiliar para obtener el historial de sesiones de una tienda
export const fetchCashSessionHistory = async (storeId: string): Promise<CashSessionAttributes[]> => {
  const response = await api.get<CashSessionResponse>(`/cash_session?store_id=${storeId}`);
  return response.data.cashSessions || [];
};

// Nueva función para verificar si una tienda tiene una sesión de caja activa
export const checkStoreActiveSession = async (storeId: string): Promise<StoreActiveSessionResponse> => {
  const response = await api.get<StoreActiveSessionResponse>(`/cash_session/store/${storeId}/active`);
  return response.data;
};
