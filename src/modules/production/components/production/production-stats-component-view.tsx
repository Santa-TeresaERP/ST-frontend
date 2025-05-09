import React, { useState } from 'react';
import ProductionModal from './productionModal';
import EditProductionModal from './editProductionModal';
import DeleteConfirmationModal from './deleteConfirmationModal';
import {FiPlus, FiTrendingUp} from 'react-icons/fi';
import { Trash2 } from 'lucide-react';
import { FiEdit } from 'react-icons/fi';
import PlantModal from './planModal';
import { Plant } from './planModal';

export interface ProductionData {
  id: string;
  produccion: string;
  cantidad: number;
  descripcion: string;
  planta: string;
  fecha: string;
  perdidas?: number;
}

interface ProductionTableViewProps {
  data?: ProductionData[];
}

const ProductionView: React.FC<ProductionTableViewProps> = ({ data = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productionToDelete, setProductionToDelete] = useState<string | null>(null);
  const [isPlantModalOpen, setIsPlantModalOpen] = useState(false);
  const [plants, setPlants] = useState<string[]>(['Santa Teresa', 'Santa Catalina']);
  const [productions, setProductions] = useState<ProductionData[]>(data.length > 0 ? data : [
    
    {
      id: '1',
      produccion: 'Aceite de Oliva Extra Virgen',
      cantidad: 1500,
      descripcion: 'Lote de producción primavera 2023',
      planta: 'Santa Teresa',
      fecha: '2023-04-15',
      perdidas: 50
    },
    {
      id: '2',
      produccion: 'Aceitunas Verdes',
      cantidad: 3200,
      descripcion: 'Envasado para exportación',
      planta: 'Santa Teresa',
      fecha: '2023-04-18'
    }
  ]);
  const [currentProduction, setCurrentProduction] = useState<ProductionData | null>(null);

  const handleAddProduction = (newProduction: Omit<ProductionData, 'id'>) => {
    const productionWithId = {
      ...newProduction,
      id: Math.random().toString(36).substr(2, 9),
      cantidad: Number(newProduction.cantidad)
    };
    setProductions([...productions, productionWithId]);
    setIsModalOpen(false);
  };

  const handleEditProduction = (editedProduction: ProductionData) => {
    setProductions(productions.map(prod => 
      prod.id === editedProduction.id ? editedProduction : prod
    ));
    setIsEditModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setProductionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (productionToDelete) {
      setProductions(productions.filter(prod => prod.id !== productionToDelete));
    }
    setProductionToDelete(null);
  };

  const handleEdit = (production: ProductionData) => {
    setCurrentProduction(production);
    setIsEditModalOpen(true);
  };

  const handleSavePlants = (newPlants: Plant[]) => {
    setPlants(newPlants.map(plant => plant.nombre));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold pb-4 flex text-green-700 items-center gap-2">
          <FiTrendingUp size={24} />
          <span>Gestión de Producción</span>
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setIsPlantModalOpen(true)}
            className="bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            Plantas
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white hover:bg-gray-300 text-black border border-gray-300 px-4 py-2 rounded-lg flex items-center"
          >
            <FiPlus className="mr-2" />
            Registrar Producción
          </button>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-200 shadow">
        <table className="w-full border-collapse text-gray-600 text-sm ">
          <thead className="bg-gray-700 text-white text-xs uppercase sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left">Producción</th>
              <th className="px-4 py-3 text-left">Cantidad</th>
              <th className="px-4 py-3 text-left">Descripción</th>
              <th className="px-4 py-3 text-left">Planta</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productions.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 text-sm hover:bg-gray-50">
                <td className="px-6 py-4">{item.produccion}</td>
                <td className="px-6 py-4">{item.cantidad}</td>
                <td className="px-6 py-4">{item.descripcion}</td>
                <td className="px-6 py-4">{item.planta}</td>
                <td className="px-6 py-4">{item.fecha}</td>
                <td className="px-6 py-4 flex justify-center space-x-2">
                  <div className="flex space-x-2 justify-center">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="p-1 rounded-full"
                      >
                        <FiEdit className="text-green-600 hover:text-green-800" size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-1 rounded-full"
                      >
                        <Trash2 className="text-red-600 hover:text-red-800" size={14} />
                      </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddProduction}
        plants={plants} // Pasa las plantas al modal de producción
      />

      {currentProduction && (
        <EditProductionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditProduction}
          production={currentProduction}
          plants={plants} // Pasa las plantas al modal de edición
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={productions.find(p => p.id === productionToDelete)?.produccion}
      />

      <PlantModal
        isOpen={isPlantModalOpen}
        onClose={() => setIsPlantModalOpen(false)}
        onSave={handleSavePlants}
      />
    </div>
  );
};

export default ProductionView;