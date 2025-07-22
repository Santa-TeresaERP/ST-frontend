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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl relative mx-2">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-5 rounded-t-2xl flex items-center justify-center relative">
          <h3 className="text-xl font-semibold text-center">Registro Completo de Cierre de Caja</h3>
          <button 
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
            aria-label="Cerrar modal"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-5 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Usuario */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Usuario <span className="text-red-600">*</span>
              </label>
              <select
                {...register('user_id')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                disabled={loadingUsers}
              >
                <option value="">Seleccione un usuario</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              {errors.user_id && <p className="text-sm text-red-600 mt-1">{errors.user_id.message}</p>}
            </div>

            {/* Tienda */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Tienda <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={selectedStore?.store_name || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
                placeholder="Nombre de la tienda"
              />
              <input type="hidden" {...register('store_id')} value={selectedStore?.id || ''} />
              {errors.store_id && <p className="text-sm text-red-600 mt-1">{errors.store_id.message}</p>}
            </div>

            {/* Dinero Inicial */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Dinero Inicial (S/) <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                inputMode="decimal"
                pattern="^[0-9]+(\.[0-9]{1,2})?$"
                {...register('start_amount')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="200.00"
              />
              {errors.start_amount && <p className="text-sm text-red-600 mt-1">{errors.start_amount.message}</p>}
            </div>

            {/* Dinero Final */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Dinero Final (S/) <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                inputMode="decimal"
                pattern="^[0-9]+(\.[0-9]{1,2})?$"
                {...register('end_amount')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="500.00"
              />
              {errors.end_amount && <p className="text-sm text-red-600 mt-1">{errors.end_amount.message}</p>}
            </div>

            {/* Total Pérdidas */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Total Pérdidas (S/) <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                inputMode="decimal"
                pattern="^[0-9]+(\.[0-9]{1,2})?$"
                {...register('total_returns')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="20.00"
              />
              {errors.total_returns && <p className="text-sm text-red-600 mt-1">{errors.total_returns.message}</p>}
            </div>

            {/* Fecha de Término */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Fecha de Término <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                {...register('ended_at')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              {errors.ended_at && <p className="text-sm text-red-600 mt-1">{errors.ended_at.message}</p>}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-600 transition"
            >
              Registrar Cierre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateCashRegister;