import React, { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { useUpdateStore } from '../../hooks/useStore';
import { updateStoreSchema, UpdateStoreForm } from '../../schemas/store.schema';
import { StoreAttributes } from '../../types/store.d';
import { FiHome } from 'react-icons/fi';
import { X } from 'lucide-react';

interface ModalEditStoreProps {
  isOpen: boolean;
  onClose: () => void;
  store: StoreAttributes | null;
  onStoreUpdate?: (storeId: string) => void
}

const ModalEditStore: React.FC<ModalEditStoreProps> = ({ isOpen, onClose, store, onStoreUpdate }) => {

  const [formData, setFormData] = useState<UpdateStoreForm>({
    id: '',
    store_name: '',
    address: '',
    observations: ''
  });
  const [errors, setErrors] = useState<Partial<UpdateStoreForm>>({});

  const updateStoreMutation = useUpdateStore();

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (store && isOpen) {
      setFormData({
        id: store.id,
        store_name: store.store_name,
        address: store.address,
        observations: store.observations || ''
      });
    }
  }, [store, isOpen]);

  const handleInputChange = (field: keyof UpdateStoreForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = updateStoreSchema.parse(formData);
      await updateStoreMutation.mutateAsync(validatedData);
      
      if (onStoreUpdate) onStoreUpdate(validatedData.id);

      setErrors({});
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error al actualizar tienda:', error);
      }
      // Manejar errores de validación
      const validationResult = updateStoreSchema.safeParse(formData);
      if (!validationResult.success) {
        const fieldErrors: Partial<UpdateStoreForm> = {};
        validationResult.error.errors.forEach(err => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as keyof UpdateStoreForm] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      id: '',
      store_name: '',
      address: '',
      observations: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl relative mx-2">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-5 rounded-t-2xl flex items-center justify-center relative gap-2">
          <FiHome size={24} />
          <h2 className="text-xl font-semibold text-center">Editar Tienda</h2>
          <button
            onClick={handleClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
          >
            <X size={22} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
          {/* Mensaje genérico de error */}
          {Object.values(errors).some(Boolean) && (
            <p className="text-sm text-red-600 font-medium">
              Revisa los campos marcados.
            </p>
          )}

          {/* Campos */}
          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Nombre de la Tienda <span className="text-red-600">*</span>
              </label>
              <Input
                id="store_name"
                type="text"
                value={formData.store_name}
                onChange={(e) => handleInputChange('store_name', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
              {errors.store_name && (
                <p className="text-sm text-red-600 mt-1">{errors.store_name}</p>
              )}
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Dirección <span className="text-red-600">*</span>
              </label>
              <Input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
              {errors.address && (
                <p className="text-sm text-red-600 mt-1">{errors.address}</p>
              )}
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Observaciones
              </label>
              <textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => handleInputChange('observations', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                rows={3}
              />
              {errors.observations && (
                <p className="text-sm text-red-600 mt-1">{errors.observations}</p>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateStoreMutation.isPending}
              className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2 disabled:opacity-50"
            >
              {updateStoreMutation.isPending ? 'Actualizando...' : 'Actualizar Tienda'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditStore;
