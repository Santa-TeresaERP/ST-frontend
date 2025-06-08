/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useUpdateProduction } from '../../hook/useProductions';
import { useFetchPlants } from '../../hook/usePlants';
import { X } from 'lucide-react';

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

  useEffect(() => {
    if (production) {
      setProduccion(production.productId);
      setCantidad(production.quantityProduced.toString());
      setDescripcion(production.observation);
      setPlanta(production.plant_id || '');
      setFecha(production.productionDate);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-xl font-bold text-gray-800">Editar Producción</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Producto*</label>
            <input
              type="text"
              name="produccion"
              value={produccion}
              onChange={(e) => setProduccion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
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
              Actualizar Producción
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditProduction;