import React from 'react';
import { FiBox } from 'react-icons/fi';


const ProductionStatsComponentView: React.FC = () => {
    return (
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FiBox className="mr-2" /> Gestión de Productos
            </h2>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              + Nueva Produccion
            </button>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
            <p className="text-blue-700">Aquí podrás gestionar tu catalogo de produccion</p>
          </div>
        </div>
      );
};

export default ProductionStatsComponentView;