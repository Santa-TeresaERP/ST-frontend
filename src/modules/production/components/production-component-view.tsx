import React, { useState } from 'react';
import ProductComponentView from './product/products-views';
import ProductionStatsComponentView from './production/production-stats-component-view';
import LostComponentView from './lost/lost-component-view';
import { FiBox, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';
import { ShieldAlert, Loader2 } from 'lucide-react';

// 🔥 IMPORTAR SISTEMA DE PERMISOS OPTIMIZADO
import { useModulePermissions } from '@/core/utils/permission-hooks';
import { MODULE_NAMES } from '@/core/utils/useModulesMap';

const ProductionComponentView: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'producto' | 'produccion' | 'perdidas'>('producto');

  // 🔥 USAR HOOK OPTIMIZADO DE PERMISOS - UNA SOLA LLAMADA
  const { canView, isLoading, isAdmin } = useModulePermissions(MODULE_NAMES.PRODUCTION);

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
            No tienes permisos para ver el módulo de producción.
          </p>
          <p className="text-sm text-gray-500">
            Contacta al administrador para obtener acceso.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-center text-red-700 pb-4">Panel de Producción</h1>
        <p className="text-gray-600 text-center">Gestión completa de productos, producción y pérdidas</p>
      </div>

      {/* 🔥 INDICADOR DE PERMISOS EN DESARROLLO */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Debug Permisos:</strong> 
            Módulo: {MODULE_NAMES.PRODUCTION} | 
            Ver: {canView ? '✅' : '❌'} | 
            Admin: {isAdmin ? '✅' : '❌'} |
            Loading: {isLoading ? '⏳' : '✅'}
          </p>
        </div>
      )}

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-9">
        <button
          onClick={() => setSelectedView('producto')}
          className={`p-6 rounded-xl shadow-sm transition-all duration-300 transform hover:scale-105 ${
            selectedView === 'producto'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
              : 'bg-white border border-gray-200 hover:border-blue-300'
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
          onClick={() => setSelectedView('produccion')}
          className={`p-6 rounded-xl shadow-sm transition-all duration-300 transform hover:scale-105 ${
            selectedView === 'produccion'
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
              : 'bg-white border border-gray-200 hover:border-green-300'
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
          onClick={() => setSelectedView('perdidas')}
          className={`p-6 rounded-xl shadow-sm transition-all duration-300 transform hover:scale-105 ${
            selectedView === 'perdidas'
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
              : 'bg-white border border-gray-200 hover:border-orange-300'
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