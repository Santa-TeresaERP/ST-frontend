import api from '@/core/config/client';
import { CashSessionAttributes } from '../types/cash_sessions.d';

export const getCashSessions = async (): Promise<CashSessionAttributes[]> => {
  const response = await api.get('/cash_session');
  return response.data.cashSessions;
};

export const createCashSession = async (
  cashSession: Omit<CashSessionAttributes, 'id'>,
): Promise<CashSessionAttributes> => {
  const response = await api.post('/cash_session', cashSession);
  return response.data.cashSession;
};