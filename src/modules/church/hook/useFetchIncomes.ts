import { useEffect, useState } from "react";
import { fetchIncomes } from "../actions/incomeChurch";
import type { IncomeChurch } from "../types/incomeChurch";

export default function useFetchIncomes() {
  const [data, setData] = useState<IncomeChurch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchIncomes();
      setData(res);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? "Error al cargar ingresos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { data, loading, error, refetch: load };
}
