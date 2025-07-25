import { useState, useEffect } from 'react';
import {
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from '../action/paymentMethod';
import { PaymentMethod } from '../types/paymentMethod';

export function usePaymentMethod() {
  const [data, setData] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res: PaymentMethod[] = await getPaymentMethods();
      setData(res);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Error desconocido al obtener métodos de pago');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const create = async (item: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> => {
    setLoading(true);
    setError(null);
    try {
      const newItem = await createPaymentMethod(item);
      await fetchAll();
      return newItem;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Error desconocido al crear método de pago');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, item: Partial<PaymentMethod>): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await updatePaymentMethod(id, item);
      await fetchAll();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Error desconocido al actualizar método de pago');
      }
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await deletePaymentMethod(id);
      await fetchAll();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Error desconocido al eliminar método de pago');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    create,
    update,
    remove,
    refetch: fetchAll,
  };
}
