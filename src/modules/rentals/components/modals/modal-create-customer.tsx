import React, { useState, useEffect } from 'react';
import { FiUser, FiX } from 'react-icons/fi';
import { useCreateCustomer } from '../../hook/useCustomers';
import { CreateCustomerRequest, Customer } from '../../types/customer';

interface ModalCreateCustomerProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerCreated: (customer: Customer) => void;
  initialName?: string; // Nombre inicial predefinido
}

const ModalCreateCustomer: React.FC<ModalCreateCustomerProps> = ({
  isOpen,
  onClose,
  onCustomerCreated,
  initialName = '',
}) => {
  const [formData, setFormData] = useState<CreateCustomerRequest>({
    full_name: initialName,
    dni: 0,
    phone: '',
    email: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const createCustomerMutation = useCreateCustomer();

  // Actualizar el nombre cuando cambie initialName
  useEffect(() => {
    if (initialName && initialName !== formData.full_name) {
      setFormData(prev => ({ ...prev, full_name: initialName }));
    }
  }, [initialName, formData.full_name]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'dni' ? parseInt(value) || 0 : value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'El nombre completo es requerido';
    }

    if (!formData.dni || formData.dni <= 0) {
      newErrors.dni = 'El DNI es requerido y debe ser válido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email debe ser válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const newCustomer = await createCustomerMutation.mutateAsync(formData);
      onCustomerCreated(newCustomer);
      handleClose();
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      full_name: '',
      dni: 0,
      phone: '',
      email: '',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 max-w-md mx-4 overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-red-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FiUser size={20} />
            <h2 className="text-xl font-bold text-white">
              Nuevo Cliente
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={`w-full p-2 border-2 rounded text-gray-700 focus:outline-none ${
                errors.full_name 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-orange-400 focus:border-red-500'
              }`}
              placeholder="Juan Pérez"
            />
            {errors.full_name && (
              <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>
            )}
          </div>

          <div>
            <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-1">
              DNI <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="dni"
              name="dni"
              value={formData.dni || ''}
              onChange={handleChange}
              className={`w-full p-2 border-2 rounded text-gray-700 focus:outline-none ${
                errors.dni 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-orange-400 focus:border-red-500'
              }`}
              placeholder="12345678"
            />
            {errors.dni && (
              <p className="text-red-500 text-xs mt-1">{errors.dni}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full p-2 border-2 rounded text-gray-700 focus:outline-none ${
                errors.phone 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-orange-400 focus:border-red-500'
              }`}
              placeholder="999999999"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border-2 rounded text-gray-700 focus:outline-none ${
                errors.email 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-orange-400 focus:border-red-500'
              }`}
              placeholder="juan@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={createCustomerMutation.isPending}
              className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createCustomerMutation.isPending}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {createCustomerMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <span>Guardar</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateCustomer;
