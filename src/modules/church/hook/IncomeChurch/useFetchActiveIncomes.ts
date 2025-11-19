import { useEffect, useState } from "react";
import { fetchActiveIncomes } from "../../actions/incomeChurch";
import type { IncomeChurch } from "../../types/incomeChurch";

export default function useFetchActiveIncomes() {
  const [data, setData] = useState<IncomeChurch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchActiveIncomes();
      setData(res);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? "Error al cargar ingresos activos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { data, loading, error, refetch: load };
}
