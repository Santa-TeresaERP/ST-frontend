/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { getSalesChannels, createSalesChannel, updateSalesChannel, deleteSalesChannel } from '../action/salesChannel';
import { SalesChannel } from '../types/salesChannel';

export function useSalesChannel() {
  const [data, setData] = useState<SalesChannel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSalesChannels();
      setData(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const create = async (item: Omit<SalesChannel, 'id'>): Promise<SalesChannel> => {
    setLoading(true);
    setError(null);
    try {
      const newItem = await createSalesChannel(item);
      await fetchAll();
      return newItem;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, item: Partial<SalesChannel>) => {
    setLoading(true);
    setError(null);
    try {
      await updateSalesChannel(id, item);
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
      await deleteSalesChannel(id);
      await fetchAll();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, create, update, remove, refetch: fetchAll };
} 