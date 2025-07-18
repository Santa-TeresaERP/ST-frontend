import React, { useState } from 'react';
import { FiInfo, FiMapPin, FiHome, FiClipboard, FiDollarSign, FiPlus } from 'react-icons/fi';
import ModalCreateCashRegister from './modal-create-cashregister';
import ModalEditStore from '@/modules/stores/components/store/modal-edit-store';
import { useCashSession, useFetchUsers } from '../../hooks/useCashSession';
import { CashSessionAttributes } from '../../types/cash_sessions.d';
interface InformationComponentViewProps {
  selectedStore?: StoreAttributes | null;
  onStoreUpdate?: (storeId: string) => void; // NUEVO
}

const InformationComponentView: React.FC<InformationComponentViewProps> = ({ selectedStore, onStoreUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditStoreModalOpen, setIsEditStoreModalOpen] = useState(false);
  const { cashSessions, isLoading, isError, createCashSession } = useCashSession();
  const { data: users = [] } = useFetchUsers();

  const handleCreateCashRegister = (data: Omit<CashSessionAttributes, 'id'>) => {
    createCashSession(data);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-6">
      {/* Información de la Tienda */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-red-700 flex items-center space-x-2">
          <FiInfo className="text-red-600" size={24} />
          <span>Información de la Tienda</span>
        </h2>
        {selectedStore && (
          <button
            onClick={() => setIsEditStoreModalOpen(true)}
            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors ml-auto"
            style={{ minWidth: 0 }}
          >
            <FiPlus size={18} />
            <span>Editar Tienda</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <FiHome className="text-red-500" size={20} />
            <span className="font-semibold">Nombre de la tienda</span>
          </div>
          <p className={selectedStore ? 'text-gray-900' : 'text-gray-400 italic'}>
            {selectedStore ? selectedStore.store_name : 'Selecciona una tienda para ver su información'}
          </p>
        </div>

        <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <FiMapPin className="text-red-500" size={20} />
            <span className="font-semibold">Dirección</span>
          </div>
          <p className={selectedStore ? 'text-gray-900' : 'text-gray-400 italic'}>
            {selectedStore ? selectedStore.address : 'Selecciona una tienda para ver su dirección'}
          </p>
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg p-4 shadow-sm text-gray-700">
        <div className="flex items-center space-x-2 mb-2">
          <FiClipboard className="text-red-500" size={20} />
          <span className="font-semibold">Observaciones</span>
        </div>
        <p className={selectedStore ? 'text-gray-900' : 'text-gray-400 italic'}>
          {selectedStore ? 
            (selectedStore.observations || 'Sin observaciones registradas') : 
            'Selecciona una tienda para ver sus observaciones'
          }
        </p>
      </div>

      {/* Información de la Caja */}
      <div className="flex justify-between items-center pt-6">
        <h2 className="text-2xl font-bold text-red-700 flex items-center space-x-2">
          <FiDollarSign className="text-red-600" size={24} />
          <span>Información de Caja</span>
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FiPlus size={18} />
          <span>Registrar Cierre</span>
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm bg-white">
        {isLoading ? (
          <div className="flex justify-center items-center h-20">
            <span className="text-gray-500">Cargando información de caja...</span>
          </div>
        ) : isError ? (
          <div className="text-red-600 p-4">Error al cargar la información de caja.</div>
        ) : (
          <table className="min-w-full bg-white text-left text-gray-700">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-2 text-center">Usuario</th>
                <th className="px-4 py-2 text-center">Tienda</th>
                <th className="px-4 py-2 text-center">Dinero Inicial</th>
                <th className="px-4 py-2 text-center">Dinero Final</th>
                <th className="px-4 py-2 text-center">Total Pérdidas</th>
                <th className="px-4 py-2 text-center">Fecha de Término</th>
              </tr>
            </thead>
            <tbody>
              {cashSessions
                ?.filter((session) => String(session.store_id) === String(selectedStore?.id))
                .map((session) => (
                  <tr key={session.id} className="border-t">
                    <td className="px-4 py-2 text-center">{
                      users.find(u => u.id === session.user_id)?.name || session.user_id
                    }</td>
                    <td className="px-4 py-2 text-center">{selectedStore?.store_name}</td>
                    <td className="px-4 py-2 text-center">S/ {Number(session.start_amount).toFixed(2)}</td>
                    <td className="px-4 py-2 text-center">S/ {Number(session.end_amount).toFixed(2)}</td>
                    <td className="px-4 py-2 text-center">S/ {Number(session.total_returns).toFixed(2)}</td>
                    <td className="px-4 py-2 text-center">{new Date(session.ended_at).toLocaleDateString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de registro de cierre de caja */}
      <ModalCreateCashRegister
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCashRegister}
        selectedStore={selectedStore}
      />
      <ModalEditStore
        isOpen={isEditStoreModalOpen}
        onClose={() => setIsEditStoreModalOpen(false)}
        store={selectedStore ?? null}
        onSuccess={async () => {
          setIsEditStoreModalOpen(false);
          if (selectedStore && typeof onStoreUpdate === 'function') {
            await onStoreUpdate(selectedStore.id);
          }
        }}
      />
    </div>
  );
};

export default InformationComponentView;