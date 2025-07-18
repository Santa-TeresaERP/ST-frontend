/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useCreateProduction } from '../../hook/useProductions';
import { useFetchPlants } from '../../hook/usePlants';
import { useFetchProducts } from '../../hook/useProducts';
import { X, Save } from 'lucide-react';

interface ModalCreateProductionProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalCreateProduction: React.FC<ModalCreateProductionProps> = ({ isOpen, onClose }) => {
  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [planta, setPlanta] = useState('');
  const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0]);

  const createProductionMutation = useCreateProduction();
  const { data: plantas, isLoading: isLoadingPlantas, error: errorPlantas } = useFetchPlants();
  const { data: productos, isLoading: isLoadingProductos, error: errorProductos } = useFetchProducts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!producto || !cantidad || !descripcion || !planta || !fecha) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const nuevaProduccion = {
      productId: producto,
      quantityProduced: Number(cantidad),
      productionDate: fecha,
      observation: descripcion,
      plant_id: planta,
    };

    try {
      await createProductionMutation.mutateAsync(nuevaProduccion);
      setProducto('');
      setCantidad('');
      setDescripcion('');
      setPlanta('');
      setFecha(new Date().toISOString().split('T')[0]);
      onClose();
    } catch (error) {
      console.error('Error al crear la producción:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-t-2xl p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Registrar Nueva Producción</h2>
            <p className="text-red-100 mt-1 text-sm">Completa la información de la producción</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-red-700 text-white transition"
            aria-label="Cerrar modal"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Producto*</label>
            {isLoadingProductos ? (
              <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
            ) : errorProductos ? (
              <p className="text-red-500 text-sm">Error al cargar productos</p>
            ) : (
              <select
                value={producto}
                onChange={(e) => setProducto(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">Seleccione un producto</option>
                {productos?.map((prod: any) => (
                  <option key={prod.id} value={prod.id}>{prod.name}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad Producida*</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Observación*</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Planta*</label>
            {isLoadingPlantas ? (
              <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
            ) : errorPlantas ? (
              <p className="text-red-500 text-sm">Error al cargar plantas</p>
            ) : (
              <select
                value={planta}
                onChange={(e) => setPlanta(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">Seleccione una planta</option>
                {plantas?.map((plt: any) => (
                  <option key={plt.id} value={plt.id}>{plt.plant_name}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Producción*</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white shadow-md hover:shadow-lg transition"
            >
              <Save size={18} /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateProduction;
