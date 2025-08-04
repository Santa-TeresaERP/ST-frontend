/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { getEntrances, createEntrance, updateEntrance, deleteEntrance } from '../action/entrance';
import { Entrance, EntrancePayload } from '../types/entrance';

export function useEntrance() {
  const [data, setData] = useState<Entrance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getEntrances();
      setData(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const create = async (item: EntrancePayload) => {
    setLoading(true);
    setError(null);
    try {
      await createEntrance(item);
      await fetchAll();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, item: Partial<EntrancePayload>) => {
    setLoading(true);
    setError(null);
    try {
      await updateEntrance(id, item);
      await fetchAll();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteEntrance(id);
      await fetchAll();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, create, update, remove, refetch: fetchAll };
} 