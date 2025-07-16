import React from 'react';
import { FiX } from 'react-icons/fi';

interface ModalCreateCashRegisterProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CashRegisterData) => void;
}

interface CashRegisterData {
  usuario: string;
  tienda: string;
  dineroInicial: number;
  dineroFinal: number;
  totalPerdidas: number;
  fechaTermino: string;
  observaciones: string;
}

const ModalCreateCashRegister: React.FC<ModalCreateCashRegisterProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = React.useState<CashRegisterData>({
    usuario: '',
    tienda: 'Dulce Sabor',
    dineroInicial: 0,
    dineroFinal: 0,
    totalPerdidas: 0,
    fechaTermino: '',
    observaciones: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['dineroInicial', 'dineroFinal', 'totalPerdidas'].includes(name) ? 
              parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación adicional
    if (formData.dineroFinal < formData.dineroInicial) {
      alert('El dinero final no puede ser menor que el dinero inicial');
      return;
    }
    
    onSubmit(formData);
    onClose();
    setFormData({
      usuario: '',
      tienda: 'Dulce Sabor',
      dineroInicial: 0,
      dineroFinal: 0,
      totalPerdidas: 0,
      fechaTermino: '',
      observaciones: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Registro Completo de Cierre de Caja</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Cerrar modal"
            >
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Usuario */}
              <div>
                <label htmlFor="usuario" className="block text-gray-700 mb-1">
                  Usuario <span className="text-red-500">*</span>
                </label>
                <input
                  id="usuario"
                  type="text"
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Nombre del responsable"
                  required
                />
              </div>

              {/* Tienda */}
              <div>
                <label htmlFor="tienda" className="block text-gray-700 mb-1">
                  Tienda <span className="text-red-500">*</span>
                </label>
                <select
                  id="tienda"
                  name="tienda"
                  value={formData.tienda}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="Dulce Sabor">Dulce Sabor</option>
                  <option value="Sucursal Norte">Sucursal Norte</option>
                  <option value="Sucursal Sur">Sucursal Sur</option>
                </select>
              </div>

              {/* Dinero Inicial */}
              <div>
                <label htmlFor="dineroInicial" className="block text-gray-700 mb-1">
                  Dinero Inicial (S/) <span className="text-red-500">*</span>
                </label>
                <input
                  id="dineroInicial"
                  type="number"
                  name="dineroInicial"
                  value={formData.dineroInicial || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="200.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              {/* Dinero Final */}
              <div>
                <label htmlFor="dineroFinal" className="block text-gray-700 mb-1">
                  Dinero Final (S/) <span className="text-red-500">*</span>
                </label>
                <input
                  id="dineroFinal"
                  type="number"
                  name="dineroFinal"
                  value={formData.dineroFinal || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="500.00"
                  step="0.01"
                  min={formData.dineroInicial}
                  required
                />
              </div>

              {/* Total Pérdidas */}
              <div>
                <label htmlFor="totalPerdidas" className="block text-gray-700 mb-1">
                  Total Pérdidas (S/) <span className="text-red-500">*</span>
                </label>
                <input
                  id="totalPerdidas"
                  type="number"
                  name="totalPerdidas"
                  value={formData.totalPerdidas || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="20.00"
                  step="0.01"
                  min="0"
                  max={formData.dineroInicial}
                  required
                />
              </div>

              {/* Fecha de Término */}
              <div>
                <label htmlFor="fechaTermino" className="block text-gray-700 mb-1">
                  Fecha de Término <span className="text-red-500">*</span>
                </label>
                <input
                  id="fechaTermino"
                  type="date"
                  name="fechaTermino"
                  value={formData.fechaTermino}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  max={new Date().toISOString().split('T')[0]} // No permite fechas futuras
                />
              </div>
            </div>

            {/* Observaciones */}
            <div>
              <label htmlFor="observaciones" className="block text-gray-700 mb-1">
                Observaciones <span className="text-red-500">*</span>
              </label>
              <textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
                placeholder="Detalles sobre diferencias, incidentes o comentarios relevantes"
                required
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              >
                Registrar Cierre
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateCashRegister;