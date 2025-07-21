/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCashSessionSchema, closeCashSessionSchema, validateCashSessionClosure } from '../schemas/cashSessionValidation';
import { useCreateCashSession, useCloseCashSession, useFetchActiveCashSession } from '../hooks/useCashSession';
import { CreateCashSessionPayload, CloseCashSessionPayload } from '../types/cash-session';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card } from '@/app/components/ui/card';
import { Dialog } from '@/app/components/ui/dialog';

// Componente para abrir una nueva sesión de caja
export const OpenCashSessionForm = ({ storeId }: { storeId: string }) => {
  const { mutate: createSession, isPending } = useCreateCashSession();
  const { data: activeSession } = useFetchActiveCashSession(storeId);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateCashSessionPayload>({
    resolver: zodResolver(createCashSessionSchema),
    defaultValues: {
      store_id: storeId,
      start_amount: 0
    }
  });

  const onSubmit = (data: CreateCashSessionPayload) => {
    createSession(data);
  };

  // Si ya hay una sesión activa, mostrar mensaje
  if (activeSession) {
    return (
      <Card className="p-4 bg-yellow-50 border-yellow-200">
        <p className="text-yellow-700">Ya existe una sesión de caja activa para esta tienda.</p>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="start_amount">Monto Inicial</Label>
        <Input
          id="start_amount"
          type="number"
          step="0.01"
          {...register('start_amount', { valueAsNumber: true })}
        />
        {errors.start_amount && (
          <p className="text-red-500 text-sm mt-1">{errors.start_amount.message}</p>
        )}
      </div>
      
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Abriendo sesión...' : 'Abrir Sesión de Caja'}
      </Button>
    </form>
  );
};

// Componente para cerrar una sesión de caja
export const CloseCashSessionForm = ({ 
  sessionId, 
  startAmount,
  onClose 
}: { 
  sessionId: string;
  startAmount: number;
  onClose: () => void;
}) => {
  const [error, setError] = useState<string | null>(null);
  const { mutate: closeSession, isPending } = useCloseCashSession();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CloseCashSessionPayload>({
    resolver: zodResolver(closeCashSessionSchema) as any,
    defaultValues: {
      end_amount: 0,
      total_sales: 0,
      total_returns: 0,
      ended_at: new Date().toISOString(),
      status: 'closed'
    }
  });

  const onSubmit = (data: CloseCashSessionPayload) => {
    // Validación adicional
    const validation = validateCashSessionClosure({
      start_amount: startAmount,
      end_amount: data.end_amount,
      total_sales: data.total_sales,
      total_returns: data.total_returns
    });

    if (!validation.success) {
      setError(validation.message);
      return;
    }

    closeSession({ id: sessionId, payload: data }, {
      onSuccess: onClose
    });
  };

  return (
    <Dialog>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-50 p-3 rounded border border-red-200">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        <div>
          <Label htmlFor="total_sales">Total de Ventas</Label>
          <Input
            id="total_sales"
            type="number"
            step="0.01"
            {...register('total_sales', { valueAsNumber: true })}
          />
          {errors.total_sales && (
            <p className="text-red-500 text-sm mt-1">{errors.total_sales.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="total_returns">Total de Devoluciones</Label>
          <Input
            id="total_returns"
            type="number"
            step="0.01"
            {...register('total_returns', { valueAsNumber: true })}
          />
          {errors.total_returns && (
            <p className="text-red-500 text-sm mt-1">{errors.total_returns.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="end_amount">Monto Final</Label>
          <Input
            id="end_amount"
            type="number"
            step="0.01"
            {...register('end_amount', { valueAsNumber: true })}
          />
          {errors.end_amount && (
            <p className="text-red-500 text-sm mt-1">{errors.end_amount.message}</p>
          )}
        </div>
        
        <div className="pt-2 flex space-x-2 justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Cerrando sesión...' : 'Cerrar Sesión de Caja'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
