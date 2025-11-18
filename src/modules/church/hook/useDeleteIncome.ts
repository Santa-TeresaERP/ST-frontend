import { useState } from "react";
import { deleteIncome } from "../actions/incomeChurch";

export default function useDeleteIncome() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (id: string) => {
    try {
      setLoading(true);
      return await deleteIncome(id);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? "Error al eliminar ingreso");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}
