import React, { useState, useEffect } from "react";
import { Plus, ShieldAlert, Lock } from "lucide-react";
import { useFetchStores } from "../../hooks/useStores";
import { StoreAttributes } from "../../types/store";
import ModalCreateStore from "./modal-create-store";
import ModalEditStore from "./modal-edit-store";
import ModalDeleteStore from "./modal-delete-store";

// 🔥 IMPORTAR SISTEMA DE PERMISOS
import { 
  AccessDeniedModal,
} from '@/core/utils';
import { useModulePermission, MODULE_NAMES } from '@/core/utils/useModulesMap';
import { useCurrentUser } from '@/modules/auth/hook/useCurrentUser';
import { useAuthStore } from '@/core/store/auth';
import { suppressAxios403Errors } from '@/core/utils/error-suppressor';

interface StoreListViewProps {
  onStoreSelect?: (store: StoreAttributes | null) => void;
  selectedStoreId?: string;
}

const StoreListView: React.FC<StoreListViewProps> = ({ 
  onStoreSelect,
  selectedStoreId 
}) => {
  // 🔥 OBTENER USUARIO ACTUAL CON SUS PERMISOS
  const { user } = useAuthStore();
  const { data: currentUserWithPermissions, isLoading: usersLoading } = useCurrentUser();
  
  // 🔥 VERIFICAR PERMISOS DEL MÓDULO VENTAS
  const { 
    hasPermission: canView, 
    isLoading: permissionsLoading 
  } = useModulePermission(MODULE_NAMES.SALES, 'canRead');
  
  const { hasPermission: canEdit } = useModulePermission(MODULE_NAMES.SALES, 'canEdit');
  const { hasPermission: canCreate } = useModulePermission(MODULE_NAMES.SALES, 'canWrite');
  const { hasPermission: canDelete } = useModulePermission(MODULE_NAMES.SALES, 'canDelete');
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = (currentUserWithPermissions as any)?.Role?.name === 'Admin';
  
  // Estados para control de acceso denegado
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [accessDeniedAction, setAccessDeniedAction] = useState('');

  // 🔥 ACTIVAR SUPRESOR DE ERRORES 403 EN LA CONSOLA
  useEffect(() => {
    suppressAxios403Errors();
  }, []);

  // 🔥 DEBUG: Ver permisos actuales
  console.log('🔍 StoreListView - Análisis de Permisos:', {
    userId: user?.id,
    userFound: !!currentUserWithPermissions,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    roleName: (currentUserWithPermissions as any)?.Role?.name,
    moduleName: MODULE_NAMES.SALES,
    permisos: { canView, canEdit, canCreate, canDelete, isAdmin },
    usersLoading,
    permissionsLoading
  });

  // 🔥 FUNCIÓN PARA MANEJAR ACCESO DENEGADO
  const handleAccessDenied = (action: string) => {
    setAccessDeniedAction(action);
    setShowAccessDenied(true);
  };

  const { data: stores, isLoading, error, refetch } = useFetchStores();
  const [selectedStore, setSelectedStore] = useState<StoreAttributes | null>(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Log para depuración
  console.log('🏪 StoreListView - stores:', stores, 'isLoading:', isLoading, 'error:', error);

  // Asegurar que stores sea un array válido
  const storesData = Array.isArray(stores) ? stores : [];

  // Todas las tiendas están disponibles (sin filtrado)
  const displayStores = storesData;

  const handleCreateStore = () => {
    // 🔥 VERIFICAR PERMISOS ANTES DE CREAR (Admin siempre puede)
    if (!canCreate && !isAdmin) {
      handleAccessDenied('crear una nueva tienda');
      return;
    }
    
    setShowCreateModal(true);
  };

  // Funciones mantenidas para los modales (aunque no se usen en la UI principal)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEditStore = (store: StoreAttributes) => {
    // 🔥 VERIFICAR PERMISOS ANTES DE EDITAR (Admin siempre puede)
    if (!canEdit && !isAdmin) {
      handleAccessDenied('editar esta tienda');
      return;
    }
    
    setSelectedStore(store);
    setShowEditModal(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeleteStore = (store: StoreAttributes) => {
    // 🔥 VERIFICAR PERMISOS ANTES DE ELIMINAR (Admin siempre puede)
    if (!canDelete && !isAdmin) {
      handleAccessDenied('eliminar esta tienda');
      return;
    }
    
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

  // 🔥 VERIFICAR ESTADOS DE CARGA
  if (isLoading || usersLoading || permissionsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 🔥 VERIFICAR SI TIENE PERMISO PARA VER EL MÓDULO
  if (!canView && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
          <ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600 mb-4">
            No tienes permisos para ver la gestión de tiendas.
          </p>
          <p className="text-sm text-gray-500">
            Contacta al administrador para obtener acceso.
          </p>
        </div>
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
      {/* 🔥 INDICADOR DE PERMISOS EN DESARROLLO */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Debug Permisos:</strong> 
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            Usuario: {(currentUserWithPermissions as any)?.name || 'No encontrado'} | 
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            Rol: {(currentUserWithPermissions as any)?.Role?.name || 'Sin rol'} | 
            Ver: {canView ? '✅' : '❌'} | 
            Editar: {canEdit ? '✅' : '❌'} | 
            Crear: {canCreate ? '✅' : '❌'} | 
            Eliminar: {canDelete ? '✅' : '❌'}
          </p>
        </div>
      )}

      {/* Header con solo el botón */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Seleccionar Tienda</h2>
        {/* 🔥 BOTÓN PROTEGIDO DE CREAR TIENDA */}
        {(canCreate || isAdmin) ? (
          <button
            onClick={handleCreateStore}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Tienda
          </button>
        ) : (
          <button
            onClick={() => handleAccessDenied('crear una nueva tienda')}
            className="bg-gray-400 text-gray-200 px-6 py-3 rounded-lg font-semibold cursor-not-allowed opacity-50 flex items-center"
            title="Sin permisos para crear tiendas"
          >
            <Lock className="w-5 h-5 mr-2" />
            Nueva Tienda
          </button>
        )}
      </div>

      {/* Store Dropdown */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <label htmlFor="store-select" className="block text-sm font-medium text-gray-700 mb-2">
          Seleccione una tienda:
        </label>
        <div className="relative">
          <select
            id="store-select"
            value={selectedStoreId || ""}
            onChange={(e) => {
              const storeId = e.target.value;
              if (storeId) {
                const store = displayStores.find(s => s.id === storeId);
                if (store) {
                  handleSelectStore(store);
                }
              }
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 appearance-none cursor-pointer"
          >
            <option value="">-- Seleccione una tienda --</option>
            {displayStores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.store_name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        {displayStores.length === 0 && (
          <div className="mt-4 text-center py-8 text-gray-500">
            No hay tiendas disponibles.
          </div>
        )}
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

      <ModalDeleteStore
        isOpen={showDeleteModal}
        onClose={handleCloseModals}
        storeId={selectedStore?.id || null}
        storeName={selectedStore?.store_name || null}
        onSuccess={handleStoreDeleted}
      />

      {/* 🔥 MODAL DE ACCESO DENEGADO */}
      <AccessDeniedModal
        isOpen={showAccessDenied}
        onClose={() => setShowAccessDenied(false)}
        title="Permisos Insuficientes"
        message="No tienes permisos para realizar esta acción en la gestión de tiendas."
        action={accessDeniedAction}
        module="Gestión de Tiendas"
      />
    </div>
  );
};

export default StoreListView;
