import { useState, useEffect } from 'react';
import { getTypePersons, createTypePerson, updateTypePerson, deleteTypePerson } from '../action/typePerson';
import { TypePerson } from '../types/typePerson';

export function useTypePerson() {
  const [data, setData] = useState<TypePerson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTypePersons();
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

  const create = async (item: Omit<TypePerson, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      await createTypePerson(item);
      await fetchAll();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, item: Partial<TypePerson>) => {
    setLoading(true);
    setError(null);
    try {
      await updateTypePerson(id, item);
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
      await deleteTypePerson(id);
      await fetchAll();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, create, update, remove, refetch: fetchAll };
} 