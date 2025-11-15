// src/modules/church/actions/incomeChurch.ts
import api from '@/core/config/client';
import type { CreateIncomeDto, UpdateIncomeDto } from "../types/incomeChurch";

export const fetchIncomes = async () => {
  const res = await api.get("/incomechurch");
  return res.data.incomes;
};

export const fetchActiveIncomes = async () => {
  const res = await api.get("/incomechurch/active");
  return res.data.incomes;
};

export const getIncome = async (id: string) => {
  const res = await api.get(`/incomechurch/${id}`);
  return res.data.income;
};

export const createIncome = async (payload: CreateIncomeDto) => {
  const res = await api.post("/incomechurch", payload);
  return res.data.income;
};

export const updateIncome = async (id: string, payload: UpdateIncomeDto) => {
  const res = await api.put(`/incomechurch/${id}`, payload);
  return res.data.income;
};

export const deleteIncome = async (id: string) => {
  await api.delete(`/incomechurch/${id}`);
  return true;
};
