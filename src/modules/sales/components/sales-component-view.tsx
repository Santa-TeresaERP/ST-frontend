import React, { useState } from 'react';
import { FiUsers, FiShoppingCart, FiPackage, FiAlertOctagon } from 'react-icons/fi';

import InformationComponentView from '@/modules/sales/components/information/information-component-view';
import StoreListView from './store/store-list-view';
import SalesComponentsView from './ sales/sale-view';
import InventoryComponentsView from './ inventory/inventory-view';
import LossesComponentView from './losses/losses-view';
import { StoreAttributes } from '../types/store';
import { useStoreState } from '@/core/store/store';
import { useModulePermissions } from '@/core/utils';
import { MODULE_NAMES } from '@/core/utils/useModulesMap';
import { Loader2, ShieldAlert } from 'lucide-react';
import SelectedStoreIndicator from './store/selected-store-indicator';

const SalesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('informacion');
  const { selectedStore, setSelectedStore } = useStoreState();

  // 🔥 USAR HOOK OPTIMIZADO DE PERMISOS - UNA SOLA LLAMADA
  const { canView, isLoading, isAdmin } = useModulePermissions(MODULE_NAMES.SALES);

  const handleStoreSelect = (store: StoreAttributes | null) => {
    console.log('🏪 Store selected in sales view:', store);
    setSelectedStore(store);
  };

  const handleStoreUpdate = async (storeId: string) => {
    // Find the updated store from the stores list or refetch
    // For now, we'll keep the current store selection
    console.log('Store updated:', storeId);
  };

  // 🔥 MOSTRAR LOADING MIENTRAS SE VERIFICAN PERMISOS
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // 🔥 VERIFICAR PERMISOS DE ACCESO AL MÓDULO
  if (!canView && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
          <ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600 mb-4">
            No tienes permisos para ver el módulo de ventas.
          </p>
          <p className="text-sm text-gray-500">
            Contacta al administrador para obtener acceso.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Cabecera */}
      <div className="text-center">
        <h1 className="text-5xl font-bold text-center text-red-700 pb-4">Panel de Ventas</h1>
        <p className="text-gray-600 text-sm">Gestión completa de información, ventas, inventario y pérdidas.</p>
      </div>

      {/* 🔥 INDICADOR DE PERMISOS EN DESARROLLO */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Debug Permisos:</strong> 
            Módulo: {MODULE_NAMES.SALES} | 
            Ver: {canView ? '✅' : '❌'} | 
            Admin: {isAdmin ? '✅' : '❌'}
          </p>
        </div>
      )}

      {/* Lista de Tiendas */}
      <StoreListView 
        onStoreSelect={handleStoreSelect}
        selectedStoreId={selectedStore?.id}
      />

      {/* Indicador de Tienda Seleccionada */}
      <SelectedStoreIndicator />

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
        {activeTab === 'informacion' && (
          <InformationComponentView 
            selectedStore={selectedStore} 
            onStoreUpdate={handleStoreUpdate}
          />
        )}
        {activeTab === 'ventas' && <SalesComponentsView selectedStore={selectedStore} />}
        {activeTab === 'inventario' && <InventoryComponentsView selectedStoreId={selectedStore?.id} />}
        {activeTab === 'perdidas' && <LossesComponentView selectedStoreId={selectedStore?.id} />}

      </div>
    </div>
  );
};

export default SalesView;