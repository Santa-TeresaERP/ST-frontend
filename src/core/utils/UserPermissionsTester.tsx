import React from 'react';
import { useFetchUsers } from '@/modules/user-creations/hook/useUsers';
import { useAuthStore } from '@/core/store/auth';
import { MODULE_IDS, Permission } from '@/core/utils/permission-types';

/**
 * 🧪 COMPONENTE PARA TESTING DE PERMISOS CON HOOK useUsers
 * Muestra los permisos reales del usuario obtenidos desde el endpoint de usuarios
 */
export const UserPermissionsTester = () => {
  const { user } = useAuthStore();
  const { data: users, isLoading } = useFetchUsers();

  // Encontrar el usuario actual con sus permisos completos
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentUserWithPermissions = users?.find(u => u.id === user?.id) as any;

  if (isLoading) {
    return <div className="p-4 text-center">Cargando permisos...</div>;
  }

  if (!user) {
    return <div className="p-4 text-center text-red-600">No hay usuario logueado</div>;
  }

  if (!currentUserWithPermissions) {
    return <div className="p-4 text-center text-orange-600">Usuario no encontrado en la lista</div>;
  }

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">🧪 Test de Permisos - Hook useUsers</h2>
      
      {/* Información del usuario */}
      <div className="mb-6 p-4 bg-white rounded border">
        <h3 className="font-semibold mb-2">👤 Información del Usuario</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div><strong>ID:</strong> {currentUserWithPermissions.id}</div>
          <div><strong>Nombre:</strong> {currentUserWithPermissions.name}</div>
          <div><strong>Email:</strong> {currentUserWithPermissions.email}</div>
          <div><strong>Estado:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-xs ${currentUserWithPermissions.status ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
              {currentUserWithPermissions.status ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
      </div>

      {/* Información del rol */}
      <div className="mb-6 p-4 bg-white rounded border">
        <h3 className="font-semibold mb-2">👑 Información del Rol</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div><strong>Rol ID:</strong> {currentUserWithPermissions.Role?.id}</div>
          <div><strong>Nombre del Rol:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-xs ${currentUserWithPermissions.Role?.name === 'Admin' ? 'bg-purple-200 text-purple-800' : 'bg-blue-200 text-blue-800'}`}>
              {currentUserWithPermissions.Role?.name}
            </span>
          </div>
          <div className="md:col-span-2"><strong>Descripción:</strong> {currentUserWithPermissions.Role?.description}</div>
        </div>
      </div>

      {/* Permisos por módulo */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">🔐 Permisos por Módulo</h3>
        <div className="space-y-3">
          {currentUserWithPermissions.Role?.Permissions?.map((permission: Permission, index: number) => {
            // Determinar el nombre del módulo
            let moduleName = 'Módulo Desconocido';
            if (permission.moduleId === MODULE_IDS.MODULES) moduleName = '📁 Módulos';
            else if (permission.moduleId === '47ded0bb-ad86-4cdb-a9d2-bb6b4d95f2a7') moduleName = '👥 Usuarios';
            else if (permission.moduleId === 'ec11b23d-be86-49f3-8821-1d4d289698ef') moduleName = '🛡️ Roles';
            else if (permission.moduleId === '604d4546-3957-4d47-a49b-3248a6e32ab5') moduleName = '📦 Inventario';
            else if (permission.moduleId === 'e895f3df-2689-44f1-8f6b-67f1c21d7acb') moduleName = '🏭 Producción';

            return (
              <div key={permission.id || index} className="p-3 bg-white rounded border">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{moduleName}</h4>
                  <span className="text-xs text-gray-500">{permission.moduleId}</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div className={`p-2 rounded text-center ${permission.canRead ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {permission.canRead ? '✅' : '❌'} Leer
                  </div>
                  <div className={`p-2 rounded text-center ${permission.canWrite ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {permission.canWrite ? '✅' : '❌'} Escribir
                  </div>
                  <div className={`p-2 rounded text-center ${permission.canEdit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {permission.canEdit ? '✅' : '❌'} Editar
                  </div>
                  <div className={`p-2 rounded text-center ${permission.canDelete ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {permission.canDelete ? '✅' : '❌'} Eliminar
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resumen para módulos específicamente */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h4 className="font-semibold mb-2">📁 Resumen para Módulo &quot;Módulos&quot;</h4>
        {(() => {
          const modulePermission = currentUserWithPermissions.Role?.Permissions?.find(
            (p: Permission) => p.moduleId === MODULE_IDS.MODULES
          );
          
          if (!modulePermission) {
            return <p className="text-red-600">❌ No se encontraron permisos para el módulo de gestión de módulos</p>;
          }
          
          return (
            <div className="text-sm">
              <p><strong>¿Puede ver módulos?</strong> {modulePermission.canRead ? '✅ SÍ' : '❌ NO'}</p>
              <p><strong>¿Puede editar módulos?</strong> {modulePermission.canEdit ? '✅ SÍ' : '❌ NO'}</p>
              <p><strong>¿Puede crear módulos?</strong> {modulePermission.canWrite ? '✅ SÍ' : '❌ NO'}</p>
              <p><strong>¿Puede eliminar módulos?</strong> {modulePermission.canDelete ? '✅ SÍ' : '❌ NO'}</p>
            </div>
          );
        })()}
      </div>

      {/* Debug raw data */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-600">🔍 Ver datos raw (para debugging)</summary>
        <pre className="mt-2 p-3 bg-gray-800 text-green-400 text-xs rounded overflow-auto max-h-60">
          {JSON.stringify(currentUserWithPermissions, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default UserPermissionsTester;
