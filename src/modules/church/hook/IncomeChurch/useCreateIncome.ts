import { useState } from "react";
import { createIncome } from "../../actions/incomeChurch";
import type { CreateIncomeDto } from "../../types/incomeChurch";

export default function useCreateIncome() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (payload: CreateIncomeDto) => {
    try {
      setLoading(true);
      return await createIncome(payload);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? "Error al crear ingreso");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}
