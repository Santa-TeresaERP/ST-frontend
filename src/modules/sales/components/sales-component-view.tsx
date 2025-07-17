import React, { useState } from 'react';
import { FiUsers, FiShoppingCart, FiPackage, FiAlertOctagon } from 'react-icons/fi';

import InformationComponentView from '@/modules/sales/components/information/information-component-view';
import StoreListView from '@/modules/stores/components/store-list-view';
import SalesComponentsView from './ sales/sale-view';
import InventoryComponentsView from './ inventory/inventory-view';
import LossesComponentView from './losses/losses-view';
import { StoreAttributes } from '@/modules/stores/types/store';

const SalesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('informacion');
  const [selectedStore, setSelectedStore] = useState<StoreAttributes | null>(null);

  const handleStoreSelect = (store: StoreAttributes | null) => {
    console.log('🏪 Store selected in sales view:', store);
    setSelectedStore(store);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Cabecera */}
      <div>
        <h1 className="text-5xl font-bold text-center text-red-700 pb-4">Panel de Ventas</h1>
        <p className="text-gray-600 text-center">Gestión completa de información, ventas, inventario y pérdidas.</p>
      </div>

      {/* Lista de Tiendas */}
      <StoreListView 
        onStoreSelect={handleStoreSelect}
        selectedStoreId={selectedStore?.id}
      />

      {/* Botones de navegación */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 px-4 md:px-9">
        {/* Botón Información */}
        <button
          onClick={() => setActiveTab('informacion')}
          className={`p-6 rounded-xl shadow-sm transition-all duration-300 transform hover:scale-105 ${
            activeTab === 'informacion'
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
              : 'bg-white border border-gray-200 hover:border-orange-300'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${
              activeTab === 'informacion' ? 'bg-orange-400' : 'bg-orange-100 text-orange-600'
            }`}>
              <FiUsers size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Información</h3>
              <p className="text-sm opacity-80">Datos generales</p>
            </div>
          </div>
        </button>

        {/* Botón Ventas */}
        <button
        onClick={() => setActiveTab('ventas')}
        className={`p-6 rounded-xl shadow-sm transition-all duration-300 transform hover:scale-105 ${
            activeTab === 'ventas'
            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
            : 'bg-white border border-gray-200 hover:border-yellow-400'
        }`}
        >
        <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${
            activeTab === 'ventas' ? 'bg-yellow-400' : 'bg-yellow-100 text-yellow-600'
            }`}>
            <FiShoppingCart size={24} />
            </div>
            <div className="text-left">
            <h3 className="font-semibold">Ventas</h3>
            <p className="text-sm opacity-80">Gestión de ventas</p>
            </div>
        </div>
        </button>


        {/* Botón Inventario */}
        <button
          onClick={() => setActiveTab('inventario')}
          className={`p-6 rounded-xl shadow-sm transition-all duration-300 transform hover:scale-105 ${
            activeTab === 'inventario'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white'
              : 'bg-white border border-gray-200 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${
              activeTab === 'inventario' ? 'bg-amber-400' : 'bg-amber-100 text-amber-600'
            }`}>
              <FiPackage size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Inventario</h3>
              <p className="text-sm opacity-80">Stock disponible</p>
            </div>
          </div>
        </button>

        {/* Botón Pérdidas */}
        <button
          onClick={() => setActiveTab('perdidas')}
          className={`p-6 rounded-xl shadow-sm transition-all duration-300 transform hover:scale-105 ${
            activeTab === 'perdidas'
              ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white'
              : 'bg-white border border-gray-200 hover:border-rose-400'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${
              activeTab === 'perdidas' ? 'bg-rose-400' : 'bg-rose-100 text-rose-600'
            }`}>
              <FiAlertOctagon size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Pérdidas</h3>
              <p className="text-sm opacity-80">Control de mermas</p>
            </div>
          </div>
        </button>
      </div>

      {/* Render de componentes según tab */}
      <div className="mt-6">
        {activeTab === 'informacion' && <InformationComponentView selectedStore={selectedStore} />}
        {activeTab === 'ventas' && <SalesComponentsView />}
        {activeTab === 'inventario' && <InventoryComponentsView />}
        {activeTab === 'perdidas' && <LossesComponentView/>}
      </div>
    </div>
  );
};

export default SalesView;
