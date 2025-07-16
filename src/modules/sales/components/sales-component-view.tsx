import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { FiUsers, FiShoppingCart, FiPackage, FiAlertOctagon } from 'react-icons/fi';

import InformationComponentView from '@/modules/sales/components/information/information-component-view';
import ModalCreateStore from './modal-create-store';
import SalesComponentsView from './ sales/sale-view';
import InventoryComponentsView from './ inventory/inventory-view';
import LossesComponentView from './losses/losses-view';

const SalesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('informacion');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Cabecera */}
      <div>
        <h1 className="text-5xl font-bold text-center text-red-700 pb-4">Panel de Ventas</h1>
        <p className="text-gray-600 text-center">Gestión completa de información, ventas, inventario y pérdidas.</p>
      </div>

      {/* Botón de nueva tienda */}
      <div className="flex justify-end items-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          Nueva Tienda
        </button>
      </div>

      {/* Campo de búsqueda */}
      <div className="relative max-w-4xl mx-auto">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Listado de tiendas..."
          className="pl-12 py-3 w-full bg-gradient-to-r from-white to-gray-50 border border-gray-300 rounded-2xl text-gray-900 shadow-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-300"
        />
      </div>

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
        {activeTab === 'informacion' && <InformationComponentView />}
        {activeTab === 'ventas' && <SalesComponentsView />}
        {activeTab === 'inventario' && <InventoryComponentsView />}
        {activeTab === 'perdidas' && <LossesComponentView/>}
      </div>

      {/* Modal Nueva Tienda */}
      <ModalCreateStore isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default SalesView;
