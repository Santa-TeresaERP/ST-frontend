import React, { useState, useEffect } from 'react';
import { useFetchModules, useUpdateModule } from '@/modules/modules/hook/useModules';
import { Card, CardContent, CardHeader, CardTitle } from '../../../app/components/ui/card';
import { Cuboid, ShieldAlert, Lock } from 'lucide-react';
import ModuleModal from './modal-update-module';
import { Module } from '@/modules/modules/types/modules';
import { useQueryClient } from '@tanstack/react-query';

// 🔥 IMPORTAR SISTEMA DE PERMISOS Y HOOK DE USUARIO ACTUAL
import { 
  AccessDeniedModal,
} from '@/core/utils';
import { useModulePermission, MODULE_NAMES } from '@/core/utils/useModulesMap';
import { useCurrentUser } from '@/modules/auth/hook/useCurrentUser';
import { useAuthStore } from '@/core/store/auth';
import { suppressAxios403Errors } from '@/core/utils/error-suppressor';

// 🔥 INTERFAZ PARA ERRORES DE AXIOS
interface AxiosError extends Error {
  response?: {
    status: number;
    data?: unknown;
  };
}

const ModuleList: React.FC = () => {
  const { data: modules, isLoading, error } = useFetchModules();
  const updateModuleMutation = useUpdateModule();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const queryClient = useQueryClient(); // 🔥 AGREGAR QUERY CLIENT
  
  // 🔥 OBTENER USUARIO ACTUAL CON SUS PERMISOS DESDE /auth/me
  const { user } = useAuthStore();
  const { data: currentUserWithPermissions, isLoading: usersLoading } = useCurrentUser();
  
  // 🔥 VERIFICAR ERROR 403 INMEDIATAMENTE - SIN USAR PERMISOS DINÁMICOS SI HAY ERROR
  const is403Error = error && (error.message.includes('403') || error.message.includes('Forbidden'));
  
  // 🔥 SOLO USAR SISTEMA DINÁMICO SI NO HAY ERROR 403
  const { 
    hasPermission: canView, 
    isLoading: permissionsLoading 
  } = useModulePermission(MODULE_NAMES.MODULES, 'canRead');
  
  const { hasPermission: canEdit } = useModulePermission(MODULE_NAMES.MODULES, 'canEdit');
  const { hasPermission: canCreate } = useModulePermission(MODULE_NAMES.MODULES, 'canWrite');
  const { hasPermission: canDelete } = useModulePermission(MODULE_NAMES.MODULES, 'canDelete');
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = (currentUserWithPermissions as any)?.Role?.name === 'Admin';
  
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [accessDeniedAction, setAccessDeniedAction] = useState('');

  // 🔥 ACTIVAR SUPRESOR DE ERRORES 403 EN LA CONSOLA
  useEffect(() => {
    suppressAxios403Errors();
  }, []);

  // 🔥 DEBUG: Ver permisos actuales
  console.log('🔍 ModuleList - Análisis de Permisos:', {
    userId: user?.id,
    userFound: !!currentUserWithPermissions,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    roleName: (currentUserWithPermissions as any)?.Role?.name,
    moduleName: MODULE_NAMES.MODULES,
    permisos: { canView, canEdit, canCreate, canDelete, isAdmin },
    usersLoading,
    permissionsLoading
  });

  // 🔥 FUNCIÓN PARA MANEJAR ACCESO DENEGADO
  const handleAccessDenied = (action: string) => {
    setAccessDeniedAction(action);
    setShowAccessDenied(true);
  };

  const handleEditClick = (module: Module) => {
    // 🔥 VERIFICAR PERMISOS ANTES DE EDITAR (Admin siempre puede)
    if (!canEdit && !isAdmin) {
      handleAccessDenied('editar este módulo');
      return;
    }
    
    setSelectedModule(module);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedModule(null);
  };

  const handleUpdateModule = async (data: Omit<Module, 'createdAt' | 'updatedAt'>) => {
    try {
      await updateModuleMutation.mutateAsync({
        id: data.id,
        payload: {
          name: data.name,
          description: data.description,
        },
      });
      handleCloseModal();
    } catch (error) {
      // 🔥 VERIFICAR SI ES ERROR 403 SIN MOSTRARLO EN CONSOLA
      const isPermissionError = (error as AxiosError)?.response?.status === 403 ||
                               error instanceof Error && (
                                 error.message.includes('403') || 
                                 error.message.includes('Forbidden')
                               );

      if (isPermissionError) {
        handleCloseModal();
        setAccessDeniedAction('editar este módulo (permisos revocados)');
        setShowAccessDenied(true);
        queryClient.invalidateQueries({ queryKey: ['users'] });
        return; // 🔥 SALIR SILENCIOSAMENTE
      }
      
      // 🔥 SOLO LOGGEAR ERRORES QUE NO SEAN 403
      console.error('Error updating module:', error);
      alert('Error al actualizar el módulo. Inténtalo de nuevo.');
    }
  };

  if (isLoading || usersLoading) return <div className="text-center text-red-800 font-semibold">Cargando módulos y permisos...</div>;
  
  // 🔥 VERIFICAR ERROR 403 INMEDIATAMENTE - NO ESPERAR A PERMISOS
  if (is403Error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
          <ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600 mb-4">
            No tienes permisos para ver la gestión de módulos del sistema.
          </p>
          <p className="text-sm text-gray-500">
            Contacta al administrador para obtener acceso.
          </p>
        </div>
      </div>
    );
  }
  
  // 🔥 SOLO ESPERAR PERMISOS SI NO HAY ERROR 403
  if (permissionsLoading) return <div className="text-center text-red-800 font-semibold">Verificando permisos...</div>;
  
  // 🔥 VERIFICAR OTROS ERRORES (que no sean 403)
  if (error && !is403Error) {
    return <div className="text-center text-red-800 font-semibold">Error cargando módulos: {error.message}</div>;
  }

  // 🔥 VERIFICAR SI TIENE PERMISO PARA VER EL MÓDULO (verificación adicional por permisos locales)
  if (!canView && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
          <ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600 mb-4">
            No tienes permisos para ver la gestión de módulos del sistema.
          </p>
          <p className="text-sm text-gray-500">
            Contacta al administrador para obtener acceso.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3 p-4">
          <Cuboid className="w-7 h-7 sm:w-8 sm:h-8 text-red-600" />
          Gestión de Módulos
        </h1>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules?.map((module, index) => (
          <Card
            key={module.id || index}
            className="rounded-xl overflow-hidden shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <CardHeader className="bg-red-700 text-white rounded-t-xl px-4 py-3">
              <CardTitle className="flex items-center gap-2">
                <Cuboid className="text-white w-5 h-5" />
                <span className="text-lg font-semibold">{module.name}</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="bg-white px-4 py-5">
              <p className="text-gray-700 text-sm mb-2">
                <span className="font-semibold text-green-700">Descripción:</span> {module.description}
              </p>

              <div className="flex justify-end mt-4">
                {/* 🔥 BOTÓN PROTEGIDO DE EDITAR */}
                {(canEdit || isAdmin) ? (
                  <button
                    className="bg-red-700 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-3xl transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(module);
                    }}
                  >
                    Editar
                  </button>
                ) : (
                  <button
                    className="bg-gray-400 text-gray-200 text-sm px-4 py-2 rounded-3xl cursor-not-allowed opacity-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccessDenied('editar este módulo');
                    }}
                    title="Sin permisos para editar"
                  >
                    <Lock className="w-4 h-4 inline mr-1" />
                    Editar
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 🔥 MODAL DE EDICIÓN (SOLO SI TIENE PERMISOS) */}
      {selectedModule && (canEdit || isAdmin) && (
        <ModuleModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          module={selectedModule}
          onSubmit={handleUpdateModule}
        />
      )}

      {/* 🔥 MODAL DE ACCESO DENEGADO */}
      <AccessDeniedModal
        isOpen={showAccessDenied}
        onClose={() => setShowAccessDenied(false)}
        title="Permisos Insuficientes"
        message="No tienes permisos para realizar esta acción en los módulos del sistema."
        action={accessDeniedAction}
        module="Gestión de Módulos"
      />
    </div>
  );
};

export default ModuleList;
