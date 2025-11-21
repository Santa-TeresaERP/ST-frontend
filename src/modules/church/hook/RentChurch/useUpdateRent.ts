import { useState } from "react";
import { updateRentChurch } from "../../actions/rentChurch";
import type { UpdateRentChurchPayload } from "../../types/rentChurch";

export default function useUpdateRent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (id: string, payload: UpdateRentChurchPayload) => {
    try {
      setLoading(true);
      return await updateRentChurch(id, payload);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? "Error al actualizar reserva");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}