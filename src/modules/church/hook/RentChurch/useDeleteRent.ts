import { useState } from "react";
import { deleteRentChurch } from "../../actions/rentChurch";

export default function useDeleteRent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (id: string) => {
    try {
      setLoading(true);
      return await deleteRentChurch(id);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? "Error al eliminar reserva");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}