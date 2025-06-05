import React, { useState } from 'react';
import ProductComponentView from './product/products-views';
import ProductionStatsComponentView from './production/production-stats-component-view';
import LostComponentView from './lost/lost-component-view';
import { FiBox, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';

const ProductionComponentView: React.FC = () => {
  // Estado para controlar la vista seleccionada
  const [selectedView, setSelectedView] = useState('Producto');

  // Función para manejar el cambio de vista
  const handleViewChange = (view: string) => {
    setSelectedView(view);
  };

  // Datos de ejemplo para la tabla
  const data = [
    { id: 1, producto: 'Producto A', produccion: 100, perdidas: 5 },
    { id: 2, producto: 'Producto B', produccion: 200, perdidas: 10 },
    { id: 3, producto: 'Producto C', produccion: 150, perdidas: 8 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-center text-red-700 pb-4">Panel de Producción</h1>
        <p className="text-gray-600 text-center">Gestión completa de productos, producción y pérdidas</p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-9">
        <button
          onClick={() => handleViewChange('Producto')}
          className={`px-4 py-2 rounded ${
            selectedView === 'Producto' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${
              selectedView === 'producto' ? 'bg-blue-400' : 'bg-blue-100 text-blue-600'
            }`}>
              <FiBox size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Productos</h3>
              <p className="text-sm opacity-80">Gestión de inventario</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleViewChange('Producción')}
          className={`px-4 py-2 rounded ${
            selectedView === 'Producción' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${
              selectedView === 'produccion' ? 'bg-green-400' : 'bg-green-100 text-green-600'
            }`}>
              <FiTrendingUp size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Producción</h3>
              <p className="text-sm opacity-80">Registro y análisis</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleViewChange('Pérdidas')}
          className={`px-4 py-2 rounded ${
            selectedView === 'Pérdidas' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${
              selectedView === 'perdidas' ? 'bg-orange-400' : 'bg-orange-100 text-orange-600'
            }`}>
              <FiAlertTriangle size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Pérdidas</h3>
              <p className="text-sm opacity-80">Control de mermas</p>
            </div>
          </div>
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {selectedView === 'producto' && <ProductComponentView />}
        {selectedView === 'produccion' && <ProductionStatsComponentView />}
        {selectedView === 'perdidas' && <LostComponentView />}
      </div>
    </div>
  );
};

export default ProductionComponentView;