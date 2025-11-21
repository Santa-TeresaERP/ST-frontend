import { useState } from "react";
import { createRentChurch } from "../../actions/rentChurch";
import type { CreateRentChurchPayload } from "../../types/rentChurch";

export default function useCreateRent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (payload: CreateRentChurchPayload) => {
    try {
      setLoading(true);
      return await createRentChurch(payload);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? "Error al crear reserva");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}