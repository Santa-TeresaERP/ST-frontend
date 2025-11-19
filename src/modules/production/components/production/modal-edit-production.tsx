/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useUpdateProduction } from '../../hook/useProductions';
import { useFetchPlants } from '../../hook/usePlants';
import { useFetchProducts } from '../../hook/useProducts';
import { X, Save } from 'lucide-react';

interface ModalEditProductionProps {
  isOpen: boolean;
  onSave: (productoEditado: any) => void;
  onClose: () => void;
  production: {
    id: string;
    productId: string;
    quantityProduced: number;
    productionDate: string;
    observation: string;
    plant_id: string;
  } | null;
}

const ModalEditProduction: React.FC<ModalEditProductionProps> = ({ isOpen, onClose, production }) => {
  const [produccion, setProduccion] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [planta, setPlanta] = useState('');
  const [fecha, setFecha] = useState('');

  const updateProductionMutation = useUpdateProduction();
  const { data: plantas, isLoading: isLoadingPlantas, error: errorPlantas } = useFetchPlants();
  const { data: productos, isLoading: isLoadingProducts, error: errorProducts } = useFetchProducts();

  // Función para convertir fecha a formato YYYY-MM-DD para input date
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return '';
    
    // Si viene en formato ISO, extraer solo la fecha
    if (dateString.includes('T')) {
      return dateString.split('T')[0];
    }
    
    // Si ya está en formato YYYY-MM-DD, devolverlo tal como está
    return dateString;
  };

  useEffect(() => {
    if (production) {
      setProduccion(production.productId);
      setCantidad(production.quantityProduced.toString());
      setDescripcion(production.observation);
      setPlanta(production.plant_id || '');
      setFecha(formatDateForInput(production.productionDate));
    }
  }, [production]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!produccion || !cantidad || !descripcion || !planta || !fecha) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const updatedProduction = {
      production_id: production?.id || '',
      productId: produccion,
      quantityProduced: Number(cantidad),
      productionDate: fecha,
      observation: descripcion,
      plant_id: planta,
    };

    try {
      if (production && production.id) {
        await updateProductionMutation.mutateAsync({ id: production.id, payload: updatedProduction });
        onClose();
      }
    } catch (error) {
      console.error('Error al actualizar la producción:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        
        <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-t-2xl p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Editar Producción</h2>
            <p className="text-red-100 mt-1 text-sm">Modifica los datos de la producción</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-red-800 text-white transition"
            aria-label="Cerrar modal"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Producto*</label>
            {isLoadingProducts ? (
              <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
            ) : errorProducts ? (
              <p className="text-red-500 text-sm">Error al cargar productos</p>
            ) : (
              <select
                name="produccion"
                value={produccion}
                onChange={(e) => setProduccion(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">Seleccione un producto</option>
                {productos?.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Cantidad Producida*</label>
            <input
              type="number"
              name="cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Observación*</label>
            <input
              type="text"
              name="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Planta*</label>
            {isLoadingPlantas ? (
              <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
            ) : errorPlantas ? (
              <p className="text-red-500 text-sm">Error al cargar plantas</p>
            ) : (
              <select
                name="planta"
                value={planta}
                onChange={(e) => setPlanta(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">Seleccione una planta</option>
                {plantas?.map((plt) => (
                  <option key={plt.id} value={plt.id}>
                    {plt.plant_name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Fecha de Producción*</label>
            <input
              type="date"
              name="fecha"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white shadow-md hover:shadow-lg transition"
            >
              <Save size={18} /> Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditProduction;
