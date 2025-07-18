import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { FiHome } from 'react-icons/fi';
import { useCreateStore } from '../../hooks/useStore';

interface ModalCreateStoreProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalCreateStore: React.FC<ModalCreateStoreProps> = ({ isOpen, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [localError, setLocalError] = useState('');

  const createStoreMutation = useCreateStore();

  const resetForm = () => {
    setNombre('');
    setDireccion('');
    setObservaciones('');
    setLocalError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !direccion || !observaciones) {
      setLocalError('Por favor, completa todos los campos.');
      return;
    }

    try {
      console.log('Creando tienda con datos:', { store_name: nombre, address: direccion, observations: observaciones });
      await createStoreMutation.mutateAsync({
        store_name: nombre,
        address: direccion,
        observations: observaciones
      });
      
      console.log('Tienda creada exitosamente');
      
      // Limpiar formulario y cerrar modal
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error al crear tienda:', error);
      setLocalError('Error al crear la tienda. Intenta nuevamente.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl relative mx-2">
        <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-5 rounded-t-2xl flex items-center justify-center relative gap-2">
          <FiHome size={24} />
          <h2 className="text-xl font-semibold text-center">Crear Tienda</h2>
          <button
            onClick={handleClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
          {localError && <p className="text-sm text-red-600 font-medium">{localError}</p>}

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Nombre de la Tienda <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                placeholder="Nombre de la tienda"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Dirección <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                placeholder="Dirección de la tienda"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Observaciones <span className="text-red-600">*</span>
              </label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                placeholder="Observaciones"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createStoreMutation.isPending}
              className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} /> 
              {createStoreMutation.isPending ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateStore;
