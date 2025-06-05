import React, { useState, useEffect } from 'react';
import { useFetchWarehouseResource } from '@/modules/inventory/hook/useWarehouseResources';
import { WarehouseResourceAttributes } from '@/modules/inventory/types/warehouseResource';
import { validateWarehouseResource } from '@/modules/inventory/schemas/warehouseResourceValidation';

interface ModalEditWarehousesProps {
  open: boolean;
  onClose: () => void;
  onEdit: (id: string, updates: Partial<Omit<WarehouseResourceAttributes, 'id'>>) => void;
  resourceId: string;
  onSuccess?: () => void;
}

const ModalEditWarehouses: React.FC<ModalEditWarehousesProps> = ({
  open,
  onClose,
  onEdit,
  resourceId,
}) => {
  const { data: resource } = useFetchWarehouseResource(resourceId);
  const [formData, setFormData] = useState<Partial<Omit<WarehouseResourceAttributes, 'id'>>>({
    warehouse_id: '',
    resource_id: '',
    quantity: 0,
    entry_date: new Date(),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    console.log('Editing resource ID:', resourceId);
    if (resource) {
      setFormData({
        warehouse_id: resource.warehouse_id,
        resource_id: resource.resource_id,
        quantity: resource.quantity,
        entry_date: resource.entry_date,
      });
    }
  }, [resource, resourceId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        entry_date: date,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateWarehouseResource(formData);
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.issues.forEach(issue => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    onEdit(resourceId, formData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-blue-700">Editar Recurso</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        {!resource ? (
          <div className="text-center py-4">Cargando recurso...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">ID Almacén</label>
              <input
                type="text"
                name="warehouse_id"
                value={formData.warehouse_id || ''}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.warehouse_id ? 'border-red-500' : 'border'
                }`}
              />
              {errors.warehouse_id && (
                <p className="mt-1 text-sm text-red-600">{errors.warehouse_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">ID Recurso</label>
              <input
                type="text"
                name="resource_id"
                value={formData.resource_id || ''}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.resource_id ? 'border-red-500' : 'border'
                }`}
              />
              {errors.resource_id && (
                <p className="mt-1 text-sm text-red-600">{errors.resource_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cantidad</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity || 0}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.quantity ? 'border-red-500' : 'border'
                }`}
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de Entrada</label>
              <input
                type="date"
                value={formData.entry_date ? new Date(formData.entry_date).toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateChange(new Date(e.target.value))}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.entry_date ? 'border-red-500' : 'border'
                }`}
              />
              {errors.entry_date && (
                <p className="mt-1 text-sm text-red-600">{errors.entry_date}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ModalEditWarehouses;