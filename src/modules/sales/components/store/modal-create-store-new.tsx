import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { useCreateStore } from '../../hooks/useStore';
import { createStoreSchema, CreateStoreForm } from '../../schemas/store.schema';

interface ModalCreateStoreProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalCreateStore: React.FC<ModalCreateStoreProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<CreateStoreForm>({
    store_name: '',
    address: '',
    observations: ''
  });
  const [errors, setErrors] = useState<Partial<CreateStoreForm>>({});

  const createStoreMutation = useCreateStore();

  const handleInputChange = (field: keyof CreateStoreForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = createStoreSchema.parse(formData);
      await createStoreMutation.mutateAsync(validatedData);
      
      // Limpiar formulario
      setFormData({
        store_name: '',
        address: '',
        observations: ''
      });
      setErrors({});
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error al crear tienda:', error);
      }
      // Manejar errores de validación
      const validationResult = createStoreSchema.safeParse(formData);
      if (!validationResult.success) {
        const fieldErrors: Partial<CreateStoreForm> = {};
        validationResult.error.errors.forEach(err => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as keyof CreateStoreForm] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      store_name: '',
      address: '',
      observations: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Tienda</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="store_name">Nombre de la Tienda *</Label>
            <Input
              id="store_name"
              type="text"
              value={formData.store_name}
              onChange={(e) => handleInputChange('store_name', e.target.value)}
              className={errors.store_name ? 'border-red-500' : ''}
              placeholder="Ingrese el nombre de la tienda"
            />
            {errors.store_name && (
              <p className="text-sm text-red-500">{errors.store_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección *</Label>
            <Input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className={errors.address ? 'border-red-500' : ''}
              placeholder="Ingrese la dirección"
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Observaciones</Label>
            <textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => handleInputChange('observations', e.target.value)}
              className={`w-full min-h-[80px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.observations ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Observaciones adicionales (opcional)"
            />
            {errors.observations && (
              <p className="text-sm text-red-500">{errors.observations}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createStoreMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createStoreMutation.isPending}
            >
              {createStoreMutation.isPending ? 'Creando...' : 'Crear Tienda'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCreateStore;
