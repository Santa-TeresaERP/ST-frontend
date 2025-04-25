import React, { useState } from 'react';
import ProductsView from './productsView';
import ProductionTableView from './productionView';
import LossesView from './lossView';

interface ProductionData {
  id: string;
  produccion: string;
  cantidad: number;
  descripcion: string;
  planta: string;
  fecha: string;
  perdidas: number;
}

// Cambiamos el nombre del componente principal para evitar conflicto
const ProductionGeneralView: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'Producción' | 'Productos' | 'Pérdidas'>('Producción');

  const productionData: ProductionData[] = [
    {
      id: '1', 
      produccion: 'Pasteles de chocolate',
      cantidad: 100,
      descripcion: 'pasteles saludables',
      planta: 'Santa catalina',
      fecha: '14/04/25',
      perdidas: 5
    },
    {
      id: '2', 
      produccion: 'Galletas de camote',
      cantidad: 200,
      descripcion: 'galletas suaves',
      planta: 'Santa catalina',
      fecha: '10/03/25',
      perdidas: 3
    }
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="mb-8 border-b border-red-800 pb-4">
        <h1 className="text-5xl font-bold text-red-800 text-center">{`${selectedView}`}</h1>
      </div>
      
      {/* Botones para cambiar la vista */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setSelectedView('Producción')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all border ${
            selectedView === 'Producción' 
              ? 'bg-red-800 text-white border-red-800 shadow-md' 
              : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
          }`}
        >
          Producción
        </button>
        <button
          onClick={() => setSelectedView('Productos')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all border ${
            selectedView === 'Productos' 
              ? 'bg-red-800 text-white border-red-800 shadow-md' 
              : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
          }`}
        >
          Productos
        </button>
        <button
          onClick={() => setSelectedView('Pérdidas')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all border ${
            selectedView === 'Pérdidas' 
              ? 'bg-red-800 text-white border-red-800 shadow-md' 
              : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
          }`}
        >
          Pérdidas
        </button>
      </div>
  
      {/* Contenido basado en la vista seleccionada */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
        <div className="overflow-x-auto">
          {selectedView === 'Productos' && <ProductsView data={productionData} />}
          {selectedView === 'Producción' && <ProductionTableView data={productionData} />}
          {selectedView === 'Pérdidas' && <LossesView data={productionData} />}
        </div>
      </div>
    </div>
  );
};

export default ProductionGeneralView; // Exportamos con el nuevo nombre