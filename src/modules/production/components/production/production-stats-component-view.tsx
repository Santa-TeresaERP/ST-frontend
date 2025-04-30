import React, { useState } from 'react';
import ProductionModal from './productionModal';
import EditProductionModal from './editProductionModal';
import DeleteConfirmationModal from './deleteConfirmationModal';
import {FiTrendingUp} from 'react-icons/fi';

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
  const [productions, setProductions] = useState<ProductionData[]>(data.length > 0 ? data : [
    
    {
      id: '1',
      produccion: 'Aceite de Oliva Extra Virgen',
      cantidad: 1500,
      descripcion: 'Lote de producción primavera 2023',
      planta: 'Santa Catalina',
      fecha: '2023-04-15',
      perdidas: 50
    },
    {
      id: '2',
      produccion: 'Aceitunas Verdes',
      cantidad: 3200,
      descripcion: 'Envasado para exportación',
      planta: 'Santa Catalina',
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

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold pb-4 flex text-green-700 items-center gap-2">
        <FiTrendingUp size={24} />
        <span>Gestión de Producción</span>
      </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Registrar Producción
        </button>
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-200 shadow">
        <table className="w-full border-collapse">
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
              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4">{item.produccion}</td>
                <td className="px-6 py-4">{item.cantidad}</td>
                <td className="px-6 py-4">{item.descripcion}</td>
                <td className="px-6 py-4">{item.planta}</td>
                <td className="px-6 py-4">{item.fecha}</td>
                <td className="px-6 py-4 flex justify-center space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-blue-50"
                    title="Editar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                    title="Eliminar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
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
      />

      {currentProduction && (
        <EditProductionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditProduction}
          production={currentProduction}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={productions.find(p => p.id === productionToDelete)?.produccion}
      />
    </div>
  );
};

export default ProductionView;