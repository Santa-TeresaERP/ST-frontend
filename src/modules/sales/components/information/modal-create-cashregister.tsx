import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CashSessionAttributes } from '../../types/cash_sessions.d';
import { useFetchUsers } from '../../hooks/useCashSession';
import { StoreAttributes } from '@/modules/sales/types/store.d';
import { z } from 'zod';

interface ModalCreateCashRegisterProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<CashSessionAttributes, 'id'>) => void;
  selectedStore?: StoreAttributes | null;
}

// Definir un schema para el formulario compatible con react-hook-form
const cashSessionFormSchema = z.object({
  user_id: z.string().min(1, 'Seleccione un usuario'),
  store_id: z.string().min(1, 'Seleccione una tienda'),
  start_amount: z.string().min(1, 'El monto inicial es obligatorio'),
  end_amount: z.string().min(1, 'El monto final es obligatorio'),
  total_returns: z.string().min(1, 'El total de devoluciones es obligatorio'),
  ended_at: z.string().min(1, 'La fecha de cierre es obligatoria'),
});

type FormValues = z.infer<typeof cashSessionFormSchema>;

const ModalCreateCashRegister: React.FC<ModalCreateCashRegisterProps> = ({
  isOpen,
  onClose,
  onSubmit,
  selectedStore,
}) => {
  const { data: users = [], isLoading: loadingUsers } = useFetchUsers();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(cashSessionFormSchema),
    defaultValues: {
      store_id: selectedStore?.id ? String(selectedStore.id) : '',
      ended_at: '',
      start_amount: '',
      end_amount: '',
      total_returns: '',
    },
  });

  // Sincronizar el valor de store_id con la tienda seleccionada
  useEffect(() => {
    if (isOpen && selectedStore?.id) {
      setValue('store_id', String(selectedStore.id));
    }
  }, [selectedStore, isOpen, setValue]);

  const handleFormSubmit = (data: FormValues) => {
    // Usa directamente el id (UUID) de usuario y tienda
    const selectedUser = users.find(u => String(u.id) === String(data.user_id));
    const userId = selectedUser?.id || null;
    const storeId = selectedStore?.id || null;

    console.log('selectedUser:', selectedUser);
    console.log('selectedStore:', selectedStore);
    console.log('userId:', userId, 'storeId:', storeId);

    if (!userId || !storeId) {
      alert('Debes seleccionar un usuario y una tienda válidos.');
      return;
    }

    const payload: Omit<CashSessionAttributes, 'id'> = {
      user_id: userId,
      store_id: storeId,
      start_amount: Number(data.start_amount),
      end_amount: Number(data.end_amount),
      total_returns: Number(data.total_returns),
      ended_at: new Date(data.ended_at).toISOString(),
    };
    console.log('Payload enviado a createCashSession:', payload);
    onSubmit(payload);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Registro Completo de Cierre de Caja</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Cerrar modal"
            >
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Usuario */}
              <div>
                <label htmlFor="user_id" className="block text-gray-700 mb-1">
                  Usuario <span className="text-red-500">*</span>
                </label>
                <select
                  id="user_id"
                  {...register('user_id')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={loadingUsers}
                >
                  <option value="">Seleccione un usuario</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                  ))}
                </select>
                {errors.user_id && <p className="text-red-500 text-sm mt-1">{errors.user_id.message}</p>}
              </div>

              {/* Tienda */}
              <div>
                <label htmlFor="store_id" className="block text-gray-700 mb-1">
                  Tienda <span className="text-red-500">*</span>
                </label>
                <input
                  id="store_id"
                  type="text"
                  value={selectedStore?.store_name || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Nombre de la tienda"
                />
                {/* El id real se envía oculto */}
                <input type="hidden" {...register('store_id')} value={selectedStore?.id || ''} />
                {errors.store_id && <p className="text-red-500 text-sm mt-1">{errors.store_id.message}</p>}
              </div>

              {/* Dinero Inicial */}
              <div>
                <label htmlFor="start_amount" className="block text-gray-700 mb-1">
                  Dinero Inicial (S/) <span className="text-red-500">*</span>
                </label>
                <input
                  id="start_amount"
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]+(\.[0-9]{1,2})?$"
                  {...register('start_amount')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="200.00"
                />
                {errors.start_amount && <p className="text-red-500 text-sm mt-1">{errors.start_amount.message}</p>}
              </div>

              {/* Dinero Final */}
              <div>
                <label htmlFor="end_amount" className="block text-gray-700 mb-1">
                  Dinero Final (S/) <span className="text-red-500">*</span>
                </label>
                <input
                  id="end_amount"
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]+(\.[0-9]{1,2})?$"
                  {...register('end_amount')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="500.00"
                />
                {errors.end_amount && <p className="text-red-500 text-sm mt-1">{errors.end_amount.message}</p>}
              </div>

              {/* Total Pérdidas */}
              <div>
                <label htmlFor="total_returns" className="block text-gray-700 mb-1">
                  Total Pérdidas (S/) <span className="text-red-500">*</span>
                </label>
                <input
                  id="total_returns"
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]+(\.[0-9]{1,2})?$"
                  {...register('total_returns')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="20.00"
                />
                {errors.total_returns && <p className="text-red-500 text-sm mt-1">{errors.total_returns.message}</p>}
              </div>

              {/* Fecha de Término */}
              <div>
                <label htmlFor="ended_at" className="block text-gray-700 mb-1">
                  Fecha de Término <span className="text-red-500">*</span>
                </label>
                <input
                  id="ended_at"
                  type="date"
                  {...register('ended_at')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {errors.ended_at && <p className="text-red-500 text-sm mt-1">{errors.ended_at.message}</p>}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              >
                Registrar Cierre
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateCashRegister;