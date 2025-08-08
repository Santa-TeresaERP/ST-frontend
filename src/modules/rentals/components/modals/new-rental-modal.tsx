import React, { useState, useEffect } from "react";
import { FiPlus, FiUser } from 'react-icons/fi';
import { useAuthStore } from "@/core/store/auth";
import { useFetchCustomers } from '../../hook/useCustomers';
import { Customer } from '../../types/customer';
import ModalCreateCustomer from './modal-create-customer';

interface NewRentalModalProps {
  onClose: () => void;
  onSubmit: (rentalData: {
    customerId: string;
    nombreVendedor: string;
    fechaInicio: string;
    fechaFin: string;
    monto: number;
  }) => void;
}

const NewRentalModal: React.FC<NewRentalModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    customerId: '',
    nombreVendedor: '',
    fechaInicio: '',
    fechaFin: '',
    monto: ''
  });

  const [isCreateCustomerModalOpen, setIsCreateCustomerModalOpen] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');

  // Hook para obtener customers
  const { data: customers = [] } = useFetchCustomers();

  // Filtrar customers basado en la búsqueda
  const filteredCustomers = customers.filter((customer: Customer) =>
    customer.full_name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
    customer.dni.toString().includes(customerSearchQuery)
  );

  const selectedCustomer = customers.find((c: Customer) => c.id === formData.customerId);

  // Actualizar nombre del vendedor cuando el usuario esté disponible
  useEffect(() => {
    if (user) {
      console.log("👤 Usuario activo desde store:", {
        id: user.id,
        name: user.name,
        email: user.email,
      });

      if (user.name) {
        setFormData((prev) => ({
          ...prev,
          nombreVendedor: user.name,
        }));
      }
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.customerId && formData.nombreVendedor && formData.fechaInicio && formData.fechaFin && formData.monto) {
      onSubmit({
        customerId: formData.customerId,
        nombreVendedor: formData.nombreVendedor,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        monto: parseFloat(formData.monto),
      });

      // Limpiar formulario
      setFormData({
        customerId: '',
        nombreVendedor: user?.name || '',
        fechaInicio: '',
        fechaFin: '',
        monto: ''
      });
      setCustomerSearchQuery('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCustomerSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomerSearchQuery(value);
    setShowCustomerDropdown(value.length > 0);
    
    // Si el usuario borra todo, limpiar la selección
    if (value.length === 0) {
      setFormData(prev => ({ ...prev, customerId: '' }));
    }
  };

  const handleCustomerSelect = (customer: Customer) => {
    setFormData(prev => ({ ...prev, customerId: customer.id }));
    setCustomerSearchQuery(customer.full_name);
    setShowCustomerDropdown(false);
  };

  const handleCreateNewCustomer = () => {
    setIsCreateCustomerModalOpen(true);
    setShowCustomerDropdown(false);
    // Pre-llenar el nombre con lo que el usuario escribió
    setNewCustomerName(customerSearchQuery);
  };

  const handleCustomerCreated = (newCustomer: Customer) => {
    setFormData(prev => ({ ...prev, customerId: newCustomer.id }));
    setCustomerSearchQuery(newCustomer.full_name);
    setIsCreateCustomerModalOpen(false);
    setNewCustomerName('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 max-w-md mx-4 overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-red-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white text-center">
            Nuevo Alquiler
          </h2>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Campo de búsqueda de cliente */}
            <div className="relative">
              <label htmlFor="customer-search" className="block text-sm font-medium text-gray-700 mb-1">
                Cliente
              </label>
              <input
                type="text"
                id="customer-search"
                value={customerSearchQuery}
                onChange={handleCustomerSearch}
                onFocus={() => setShowCustomerDropdown(customerSearchQuery.length > 0)}
                className="w-full p-2 border-2 border-orange-400 rounded text-gray-700 focus:outline-none focus:border-red-500"
                placeholder="Buscar cliente..."
                required
              />
              
              {/* Dropdown de customers */}
              {showCustomerDropdown && filteredCustomers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredCustomers.map((customer: Customer) => (
                    <button
                      key={customer.id}
                      type="button"
                      onClick={() => handleCustomerSelect(customer)}
                      className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <FiUser className="text-blue-600" size={14} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{customer.full_name}</div>
                          <div className="text-sm text-gray-500">DNI: {customer.dni}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Mensaje cuando no hay coincidencias */}
              {showCustomerDropdown && customerSearchQuery && filteredCustomers.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  <button
                    type="button"
                    onClick={handleCreateNewCustomer}
                    className="w-full px-3 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <FiPlus className="text-green-600" size={14} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{customerSearchQuery}</div>
                        <div className="text-sm text-green-600">Crear nuevo</div>
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {/* Mostrar cliente seleccionado */}
              {selectedCustomer && (
                <div className="mt-1 text-xs text-gray-600">
                  Cliente seleccionado: {selectedCustomer.full_name}
                </div>
              )}
            </div>

            {/* Campo vendedor */}
            <div>
              <label
                htmlFor="nombreVendedor"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre del vendedor
              </label>
              <input
                type="text"
                id="nombreVendedor"
                name="nombreVendedor"
                value={formData.nombreVendedor}
                readOnly
                className="w-full p-2 border-2 border-orange-400 bg-gray-100 text-gray-700 rounded focus:outline-none"
                placeholder="Cargando..."
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="fechaInicio"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Fecha inicio
              </label>
              <input
                type="date"
                id="fechaInicio"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleChange}
                className="w-full p-2 border-2 border-orange-400 rounded text-gray-700 focus:outline-none focus:border-red-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="fechaFin"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Fecha fin
              </label>
              <input
                type="date"
                id="fechaFin"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={handleChange}
                className="w-full p-2 border-2 border-orange-400 rounded text-gray-700 focus:outline-none focus:border-red-500"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="monto"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Monto
            </label>
            <input
              type="number"
              step="0.01"
              id="monto"
              name="monto"
              value={formData.monto}
              onChange={handleChange}
              className="w-full p-2 border-2 border-orange-400 rounded text-gray-700 focus:outline-none focus:border-red-500"
              placeholder="S/. 200.00"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>

      {/* Modal para crear nuevo customer */}
      {isCreateCustomerModalOpen && (
        <ModalCreateCustomer
          isOpen={isCreateCustomerModalOpen}
          onClose={() => setIsCreateCustomerModalOpen(false)}
          onCustomerCreated={handleCustomerCreated}
          initialName={newCustomerName}
        />
      )}
    </div>
  );
};

export default NewRentalModal;
