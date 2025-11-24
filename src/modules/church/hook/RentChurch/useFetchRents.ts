import { useEffect, useState } from "react";
import { fetchRentChurches } from "../../actions/rentChurch";
import type { RentChurch } from "../../types/rentChurch";

export default function useFetchRents() {
  const [data, setData] = useState<RentChurch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchRentChurches();
      setData(res);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? "Error al cargar reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { data, loading, error, refetch: load };
}