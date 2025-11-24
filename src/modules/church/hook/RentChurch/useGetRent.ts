import { useEffect, useState } from "react";
import { fetchRentChurchById } from "../../actions/rentChurch";
import type { RentChurch } from "../../types/rentChurch";

export default function useGetRent(id: string) {
  const [data, setData] = useState<RentChurch | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchRentChurchById(id);
      setData(res);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? "Error al cargar reserva");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) load();
  }, [id]);

  return { data, loading, error };
}