import React, { useState } from "react";
import { Plus, Search, Edit3, Eye, Trash2, MapPin, FileText } from "lucide-react";
import { useFetchStores } from "../hook/useStores";
import { StoreAttributes } from "../types/store";
import ModalCreateStore from "./store/modal-create-store";
import ModalEditStore from "./store/modal-edit-store";
import ModalViewStore from "./store/modal-view-store";
import ModalDeleteStore from "./store/modal-delete-store";

interface StoreListViewProps {
  onStoreSelect?: (store: StoreAttributes | null) => void;
  selectedStoreId?: string;
}

const StoreListView: React.FC<StoreListViewProps> = ({ 
  onStoreSelect,
  selectedStoreId 
}) => {
  const { data: stores, isLoading, error, refetch } = useFetchStores();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState<StoreAttributes | null>(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Log para depuración
  console.log('🏪 StoreListView - stores:', stores, 'isLoading:', isLoading, 'error:', error);

  // Asegurar que stores sea un array válido
  const storesData = Array.isArray(stores) ? stores : [];

  // Filtrar tiendas por término de búsqueda
  const filteredStores = storesData.filter((store) =>
    store.store_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.observations?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Todas las tiendas se consideran activas (no hay campo status en la estructura)
  const activeStores = filteredStores;
  const inactiveStores: StoreAttributes[] = []; // Array vacío ya que no hay tiendas inactivas

  const handleCreateStore = () => {
    setShowCreateModal(true);
  };

  const handleEditStore = (store: StoreAttributes) => {
    setSelectedStore(store);
    setShowEditModal(true);
  };

  const handleViewStore = (store: StoreAttributes) => {
    setSelectedStore(store);
    setShowViewModal(true);
  };

  const handleDeleteStore = (store: StoreAttributes) => {
    setSelectedStore(store);
    setShowDeleteModal(true);
  };

  const handleSelectStore = (store: StoreAttributes) => {
    console.log('🏪 Store selected:', store);
    // Llamar al callback padre si existe
    onStoreSelect?.(store);
  };

  const handleCloseModals = () => {
    setSelectedStore(null);
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    setShowDeleteModal(false);
  };

  const handleStoreCreated = () => {
    // Forzar refetch después de crear una tienda
    refetch();
    handleCloseModals();
  };

  const handleStoreUpdated = () => {
    // Forzar refetch después de actualizar una tienda
    refetch();
    handleCloseModals();
  };

  const handleStoreDeleted = () => {
    // Forzar refetch después de eliminar una tienda
    refetch();
    handleCloseModals();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="font-medium text-red-800">Error al cargar tiendas:</span>
        </div>
        <p className="text-red-700 mt-1">{error?.message || 'Error desconocido'}</p>
        <button 
          onClick={() => refetch()} 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reintentar
        </button>
        <div className="mt-2 text-sm text-gray-600">
          <p>Datos: {JSON.stringify(stores)}</p>
          <p>Estado de carga: {isLoading ? 'Cargando' : 'Completado'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Panel de Tiendas</h1>
            <p className="text-blue-100 mt-2">
              Gestiona todas las tiendas del sistema desde aquí
            </p>
          </div>
          <button
            onClick={handleCreateStore}
            className="mt-4 md:mt-0 bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Tienda
          </button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Search Bar */}
        <div className="lg:col-span-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar tiendas por nombre, dirección u observaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total de Tiendas</p>
                <p className="text-2xl font-bold text-gray-900">{storesData.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tiendas Activas</p>
                <p className="text-2xl font-bold text-gray-900">{activeStores.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tiendas Inactivas</p>
                <p className="text-2xl font-bold text-gray-900">{inactiveStores.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stores List */}
      <div className="space-y-6">
        {/* Active Stores */}
        <div>
          <div className="flex items-center mb-4">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
            <h3 className="text-xl font-semibold text-gray-800">Tiendas Activas</h3>
            <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {activeStores.length} activas
            </span>
          </div>

          {activeStores.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay tiendas activas que coincidan con la búsqueda.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeStores.map((store) => (
                <div
                  key={store.id}
                  className={`bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
                    selectedStoreId === store.id 
                      ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSelectStore(store)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className={`text-lg font-semibold ${selectedStoreId === store.id ? 'text-blue-900' : 'text-gray-900'}`}>
                      {store.store_name}
                    </h4>
                    {selectedStoreId === store.id && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Seleccionada
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm truncate">{store.address}</span>
                    </div>
                    {store.observations && (
                      <div className="flex items-start text-gray-600">
                        <FileText className="w-4 h-4 mr-2 mt-0.5" />
                        <span className="text-sm line-clamp-2">{store.observations}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewStore(store);
                      }}
                      className="p-2 text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200"
                      title="Ver detalles"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditStore(store);
                      }}
                      className="p-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                      title="Editar"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStore(store);
                      }}
                      className="p-2 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ModalCreateStore
        isOpen={showCreateModal}
        onClose={handleCloseModals}
        onSuccess={handleStoreCreated}
      />

      <ModalEditStore
        isOpen={showEditModal}
        onClose={handleCloseModals}
        store={selectedStore}
        onSuccess={handleStoreUpdated}
      />

      <ModalViewStore
        isOpen={showViewModal}
        onClose={handleCloseModals}
        store={selectedStore}
      />

      <ModalDeleteStore
        isOpen={showDeleteModal}
        onClose={handleCloseModals}
        storeId={selectedStore?.id || null}
        storeName={selectedStore?.store_name || null}
        onSuccess={handleStoreDeleted}
      />
    </div>
  );
};

export default StoreListView;
