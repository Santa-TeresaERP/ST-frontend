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

export const fetchCashSessions = async (): Promise<CashSessionAttributes[]> => {
  const response = await api.get<CashSessionResponse>('/cash_session');
  return response.data.cashSessions || [];
};

export const fetchCashSession = async (id: string): Promise<CashSessionAttributes> => {
  const response = await api.get<SingleCashSessionResponse>(`/cash_session/${id}`);
  return response.data.cashSession;
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
    const response = await api.get<CashSessionResponse>(`/cash_session?store_id=${storeId}&status=open`);
    const sessions = response.data.cashSessions || [];
    return sessions.length > 0 ? sessions[0] : null;
  } catch (error) {
    console.error('Error fetching active cash session:', error);
    return null;
  }
};

// Función auxiliar para obtener el historial de sesiones de una tienda
export const fetchCashSessionHistory = async (storeId: string): Promise<CashSessionAttributes[]> => {
  const response = await api.get<CashSessionResponse>(`/cash_session?store_id=${storeId}`);
  return response.data.cashSessions || [];
};
