import React from 'react';
import { LostAttributes } from '../../types/lost';

interface AddLostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  newLostItem: Omit<LostAttributes, 'id'>;
  setNewLostItem: React.Dispatch<React.SetStateAction<Omit<LostAttributes, 'id'>>>;
  validationError: string | null;
}

const AddLostModal: React.FC<AddLostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  newLostItem,
  setNewLostItem,
  validationError,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Registrar Nueva Pérdida</h3>
          
          {validationError && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {validationError}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newLostItem.product_id}
                onChange={(e) => setNewLostItem({...newLostItem, product_id: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newLostItem.quantity}
                onChange={(e) => setNewLostItem({...newLostItem, quantity: parseInt(e.target.value) || 0})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Pérdida</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newLostItem.lost_type}
                onChange={(e) => setNewLostItem({...newLostItem, lost_type: e.target.value})}
              >
                <option value="">Seleccionar tipo</option>
                <option value="Daño">Daño</option>
                <option value="Pérdida">Pérdida</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={newLostItem.observations || ''}
                onChange={(e) => setNewLostItem({...newLostItem, observations: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newLostItem.created_at.toISOString().split('T')[0]}
                onChange={(e) => setNewLostItem({...newLostItem, created_at: new Date(e.target.value)})}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-800 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onSubmit}
          >
            Guardar
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLostModal;