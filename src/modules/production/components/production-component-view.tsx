import React, { useState } from 'react';
import ProductosView from './producto/productos-view';

const ProductionComponentView: React.FC = () => {
  const [selectedView, setSelectedView] = useState('Producto');

  const handleViewChange = (view: string) => {
    setSelectedView(view);
  };

  const data = [
    { id: 1, producto: 'Producto A', produccion: 100, perdidas: 5 },
    { id: 2, producto: 'Producto B', produccion: 200, perdidas: 10 },
    { id: 3, producto: 'Producto C', produccion: 150, perdidas: 8 },
  ];

  return (
    <div className="space-y-4">
      {/* Botones para cambiar la vista */}
      <div className="flex space-x-4">
        <button
          onClick={() => handleViewChange('Producto')}
          className={`px-4 py-2 rounded ${selectedView === 'Producto' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Producto
        </button>
        <button
          onClick={() => handleViewChange('Producción')}
          className={`px-4 py-2 rounded ${selectedView === 'Producción' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Producción
        </button>
        <button
          onClick={() => handleViewChange('Pérdidas')}
          className={`px-4 py-2 rounded ${selectedView === 'Pérdidas' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Pérdidas
        </button>
      </div>

      {/* Renderizar vista según la selección */}
      <div>
        {selectedView === 'Producto' && <ProductosView />}

        {selectedView !== 'Producto' && (
          <>
            <h2 className="text-xl font-bold">{`Vista actual: ${selectedView}`}</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Producto</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Producción</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Pérdidas</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td className="border border-gray-300 px-4 py-2">{item.producto}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.produccion}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.perdidas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductionComponentView;