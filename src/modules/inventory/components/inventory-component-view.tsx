import React, { useState } from 'react';
import { Repeat, Home, Users, Truck } from 'lucide-react';
import WarehouseView from './warehouse/warehouse-view';
import ResourceView from './resourcehouse/resourcehouse-view';
import SuppliersView from './supplier/supplier.view';
import MovementComponentView from './movements/movement-component-view';


const InventoryComponentView: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'movimientos' | 'almacen' | 'recursos' | 'proveedores'>('movimientos');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-center text-red-700 pb-4">Panel de Almacén</h1>
        <p className="text-gray-600 text-center">Gestión completa de productos, producción y pérdidas</p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 p-6">
        {/* Movimientos */}
        <button
          onClick={() => setSelectedView('movimientos')}
          className={`p-6 rounded-xl shadow-sm transition-all duration-300 transform hover:scale-105 ${
            selectedView === 'movimientos'
              ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white'
              : 'bg-white border border-gray-200 hover:border-slate-400'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${selectedView === 'movimientos' ? 'bg-slate-400' : 'bg-slate-100 text-slate-600'}`}>
              <Repeat size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Movimientos</h3>
              <p className="text-sm opacity-80">Entradas y salidas</p>
            </div>
          </div>
        </button>

        {/* Almacén */}
        <button
          onClick={() => setSelectedView('almacen')}
          className={`p-6 rounded-xl shadow-sm transition-all duration-300 transform hover:scale-105 ${
            selectedView === 'almacen'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
              : 'bg-white border border-gray-200 hover:border-blue-400'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${selectedView === 'almacen' ? 'bg-blue-400' : 'bg-blue-100 text-blue-600'}`}>
              <Home size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Almacén</h3>
              <p className="text-sm opacity-80">Gestión de stock</p>
            </div>
          </div>
        </button>

        {/* Recursos (anaranjado suave) */}
        <button
          onClick={() => setSelectedView('recursos')}
          className={`p-6 rounded-xl shadow-sm transition-all duration-300 transform hover:scale-105 ${
            selectedView === 'recursos'
              ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white'
              : 'bg-white border border-gray-200 hover:border-orange-400'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${selectedView === 'recursos' ? 'bg-orange-300' : 'bg-orange-100 text-orange-600'}`}>
              <Users size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Recursos</h3>
              <p className="text-sm opacity-80">Materiales y humanos</p>
            </div>
          </div>
        </button>

        {/* Proveedores (verde grisáceo) */}
        <button
          onClick={() => setSelectedView('proveedores')}
          className={`p-6 rounded-xl shadow-sm transition-all duration-300 transform hover:scale-105 ${
            selectedView === 'proveedores'
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
              : 'bg-white border border-gray-200 hover:border-emerald-400'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${selectedView === 'proveedores' ? 'bg-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
              <Truck size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Proveedores</h3>
              <p className="text-sm opacity-80">Gestión de compras</p>
            </div>
          </div>
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden p-6 text-center text-gray-600 min-h-[300px]">
        {selectedView === 'movimientos' && <MovementComponentView />}
        {selectedView === 'almacen' && <WarehouseView />}
        {selectedView === 'recursos' && <ResourceView />}
        {selectedView === 'proveedores' && <SuppliersView />}
      </div>
    </div>
  );
};

export default InventoryComponentView;
