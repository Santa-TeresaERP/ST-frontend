import { useEffect, useState } from "react";
import { fetchRentChurches } from "../../actions/rentChurch";
import type { RentChurch } from "../../types/rentChurch";

export default function useFetchActiveRents() {
  const [data, setData] = useState<RentChurch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchRentChurches();
      const activeRents = res.filter((rent) => rent.status);
      setData(activeRents);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? "Error al cargar reservas activas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { data, loading, error, refetch: load };
}