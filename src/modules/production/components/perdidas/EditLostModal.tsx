import React, { useState, useEffect } from 'react';
import { LostAttributes } from '../../types/lost';

interface EditLostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lost: LostAttributes) => void;
  lost: LostAttributes | null; // Permitimos que lost pueda ser null
}

const EditLostModal: React.FC<EditLostModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  lost 
}) => {
  // Estado inicial con valores por defecto
  const [formData, setFormData] = useState<LostAttributes>({
    id: '',
    product_id: '',
    quantity: 0,
    lost_type: '',
    observations: '',
    created_at: new Date(),
  });
  
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (lost) {
      setFormData(lost);
    } else {
      // Resetear a valores por defecto si lost es null
      setFormData({
        id: '',
        product_id: '',
        quantity: 0,
        lost_type: '',
        observations: '',
        created_at: new Date(),
      });
    }
    setValidationError(null);
  }, [lost]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'quantity' ? parseInt(value) || 0 : 
              name === 'created_at' ? new Date(value) : 
              value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.product_id || !formData.lost_type) {
      setValidationError('Producto y tipo de pérdida son requeridos');
      return;
    }

    if (formData.quantity <= 0) {
      setValidationError('La cantidad debe ser mayor a 0');
      return;
    }

    setValidationError(null);
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-xl font-bold text-gray-800">
            {formData.id ? 'Editar Registro de Pérdida' : 'Nuevo Registro de Pérdida'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {validationError && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {validationError}
            </div>
          )}
          
          <div>
            <label className="block text-gray-700 mb-2">Producto</label>
            <input
              type="text"
              name="product_id"
              value={formData.product_id || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Cantidad</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity || 0}
              onChange={handleInputChange}
              min="1"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Tipo de Pérdida</label>
            <select
              name="lost_type"
              value={formData.lost_type || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="">Seleccionar tipo</option>
              <option value="Daño">Daño</option>
              <option value="Pérdida">Pérdida</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Observaciones</label>
            <textarea
              name="observations"
              value={formData.observations || ''}
              onChange={handleInputChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Fecha</label>
            <input
              type="date"
              name="created_at"
              value={formData.created_at ? formData.created_at.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-600"
            >
              {formData.id ? 'Actualizar Pérdida' : 'Guardar Pérdida'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLostModal;