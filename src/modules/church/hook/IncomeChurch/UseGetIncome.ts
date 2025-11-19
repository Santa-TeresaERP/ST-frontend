import { useEffect, useState } from "react";
import { getIncome } from "../../actions/incomeChurch";
import type { IncomeChurch } from "../../types/incomeChurch";

export default function useGetIncome(id: string) {
  const [data, setData] = useState<IncomeChurch | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getIncome(id);
      setData(res);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? "Error al cargar ingreso");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) load();
  }, [id]);

  return { data, loading, error };
}
