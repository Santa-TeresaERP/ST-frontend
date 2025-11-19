import { useState } from "react";
import { updateIncome } from "../actions/incomeChurch";
import type { UpdateIncomeDto } from "../types/incomeChurch";

export default function useUpdateIncome() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (id: string, payload: UpdateIncomeDto) => {
    try {
      setLoading(true);
      return await updateIncome(id, payload);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? "Error al actualizar ingreso");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}
