"use client";

import React, { useState, useEffect } from "react";
import { useFetchRoles, useCreateRole, useUpdateRole } from "@/modules/roles/hook/useRoles";
import { useUpdatePermission } from "@/modules/roles/hook/usePermissions";
import { useFetchModules } from "@/modules/modules/hook/useModules";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";
import { UserIcon, PlusCircle, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Role } from "@/modules/roles/types/roles";
import RoleModal from './modal-update-role';
import PermissionEditor from './permission-editor-final';
import { Button } from "@/app/components/ui/button";
import { useQueryClient } from '@tanstack/react-query';
import { useModulePermissions } from '@/core/utils/permission-hooks';
import { MODULE_IDS } from '@/core/utils/permission-types';
import AccessDeniedModal from '@/core/utils/AccessDeniedModal';

const RoleList: React.FC = () => {
  const queryClient = useQueryClient();
  const { canView, canCreate, canEdit } = useModulePermissions(MODULE_IDS.ROLES);
  const { data: roles, isLoading, error } = useFetchRoles();
  const { data: modules } = useFetchModules();
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const updatePermissionMutation = useUpdatePermission();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [accessDeniedAction, setAccessDeniedAction] = useState('');

  // Limpiar cache cuando no hay permisos
  useEffect(() => {
    if (!canView) {
      queryClient.removeQueries({ queryKey: ['roles'] });
    }
  }, [canView, queryClient]);

  // Si no tiene permisos de lectura, mostrar mensaje de acceso denegado
  if (!canView) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
          <ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600 mb-4">
            No tienes permisos para ver la gestión de roles del sistema.
          </p>
          <p className="text-sm text-gray-500">
            Contacta al administrador para obtener acceso.
          </p>
        </div>
      </div>
    );
  }

  const handleEditRoleClick = (role: Role) => {
    setSelectedRole(role);
    setIsCreatingRole(false);
    setIsRoleModalOpen(true);
  };

  const handleEditPermissionClick = (role: Role) => {
    setSelectedRole(role);
    setIsPermissionModalOpen(true);
  };

  const handleCloseRoleModal = () => {
    setIsRoleModalOpen(false);
    setSelectedRole(null);
    setIsCreatingRole(false);
  };

  const handleClosePermissionModal = () => {
    setIsPermissionModalOpen(false);
    setSelectedRole(null);
  };

  const handleCreateRole = async (data: { name: string; description: string }) => {
    try {
      console.log('Creating role with data:', data);
      const result = await createRoleMutation.mutateAsync(data);
      console.log('Role created successfully:', result);
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      handleCloseRoleModal();
    } catch (error: unknown) {
      // Si es error de permisos, mostrar modal de acceso denegado sin loggear
      const errorObj = error as { isPermissionError?: boolean; silent?: boolean; message?: string };
      if (errorObj?.isPermissionError && errorObj?.silent) {
        setAccessDeniedAction('crear roles (permisos revocados)');
        setShowAccessDenied(true);
      } else {
        console.error('Error creating role:', error);
        alert('Error al crear rol: ' + (errorObj?.message || 'Error desconocido'));
      }
    }
  };

  const handleUpdateRole = async (data: { id?: string; name: string; description: string }) => {
    try {
      console.log('Updating role with data:', data);
      if (data.id) {
        const result = await updateRoleMutation.mutateAsync({ 
          id: data.id, 
          payload: { name: data.name, description: data.description } 
        });
        console.log('Role updated successfully:', result);
        queryClient.invalidateQueries({ queryKey: ['roles'] });
      }
      handleCloseRoleModal();
    } catch (error: unknown) {
      // Si es error de permisos, mostrar modal de acceso denegado sin loggear
      const errorObj = error as { isPermissionError?: boolean; silent?: boolean; message?: string };
      if (errorObj?.isPermissionError && errorObj?.silent) {
        setAccessDeniedAction('editar roles (permisos revocados)');
        setShowAccessDenied(true);
      } else {
        console.error('Error updating role:', error);
        alert('Error al actualizar rol: ' + (errorObj?.message || 'Error desconocido'));
      }
    }
  };

  const handleUpdatePermission = async (data: { 
    id: string; 
    permissions: { 
      moduleId: string; 
      canRead: boolean; 
      canWrite: boolean; 
      canUpdate: boolean; 
      canDelete: boolean 
    }[] 
  }) => {
    try {
      console.log('🔍 handleUpdatePermission - Datos recibidos:', {
        roleId: data.id,
        roleName: selectedRole?.name,
        totalPermissions: data.permissions.length,
        permissions: data.permissions
      });

      await updatePermissionMutation.mutateAsync({ 
        id: data.id, 
        payload: { permissions: data.permissions } 
      });

      console.log('✅ Permisos actualizados para rol:', {
        roleId: data.id,
        roleName: selectedRole?.name
      });

      queryClient.invalidateQueries({ queryKey: ['roles'] });
      // NO cerrar el modal aquí, permitir que el usuario siga editando
      // handleClosePermissionModal();
    } catch (error: unknown) {
      // Si es error de permisos, mostrar modal de acceso denegado sin loggear
      const errorObj = error as { isPermissionError?: boolean; silent?: boolean; message?: string };
      if (errorObj?.isPermissionError && errorObj?.silent) {
        setAccessDeniedAction('actualizar permisos de roles (permisos revocados)');
        setShowAccessDenied(true);
      } else {
        console.error('❌ Error updating permissions:', error);
        throw error; // Re-throw para que el componente hijo pueda manejarlo
      }
    }
  };

  // Solo mostrar loading si tiene permisos
  if (canView && isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <ShieldCheck className="h-10 w-10 text-green-600 mb-4" />
        <p className="text-lg">Cargando roles...</p>
      </div>
    );
  }

  // Solo mostrar error si tiene permisos y hay un error (que no sea 403)
  if (canView && error) {
    console.error('Error fetching roles:', error);
    const isPermissionError = error.message.includes('403') || error.message.includes('Forbidden');
    
    if (isPermissionError) {
      // Si es error 403, redirigir al mensaje de acceso denegado
      // (esto no debería pasar normalmente ya que canView debería ser false)
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
            <ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">Acceso Restringido</h2>
            <p className="text-gray-600 mb-4">
              No tienes permisos para ver la gestión de roles del sistema.
            </p>
            <p className="text-sm text-gray-500">
              Contacta al administrador para obtener acceso.
            </p>
          </div>
        </div>
      );
    }
    
    return <div className="text-center text-red-800 font-semibold">Error cargando roles: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div className="flex items-center mb-4 sm:mb-0">
          <ShieldCheck className="h-8 w-8 text-red-700 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">Gestión de Roles</h2>
        </div>
        {canCreate && (
          <Button onClick={() => { setIsCreatingRole(true); setIsRoleModalOpen(true); }} className="bg-green-600 hover:bg-green-500 text-white shadow-md flex items-center mt-6 rounded-3xl">
            <PlusCircle className="mr-2 h-5 w-5" />
            Crear Nuevo Rol
          </Button>
        )}
      </div>

      {roles && roles.length === 0 && (
        <div className="bg-gray-100 p-6 rounded-xl text-center max-w-md mx-auto">
          <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay roles creados</h3>
          <p className="text-gray-500 mb-4">Crea tu primer rol para gestionar permisos.</p>
          {canCreate && (
            <Button onClick={() => { setIsCreatingRole(true); setIsRoleModalOpen(true); }} className="bg-green-600 hover:bg-green-500 text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Crear Rol
            </Button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles && roles.map((role) => (
          <Card key={role.id} className="shadow-md hover:shadow-lg transition-all border border-gray-200 rounded-xl">
            <div className="h-2 w-full bg-gradient-to-r from-red-500 to-red-700 rounded-t-xl" />
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                  <UserIcon className="h-5 w-5 text-red-700 mr-2" />
                  {role.name}
                </CardTitle>
                <span className="text-xs text-gray-500 font-medium">ID: {role.id.slice(0, 4)}...</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{role.description || <span className="italic text-gray-400">Sin descripción</span>}</p>
              <div className="flex justify-end gap-4 pt-6">
                {canEdit && (
                  <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50 rounded-3xl" onClick={() => handleEditRoleClick(role)}>
                    Editar
                  </Button>
                )}
                {canEdit && (
                  <Button className="bg-green-600 hover:bg-green-500 text-white rounded-3xl" onClick={() => handleEditPermissionClick(role)}>
                    Permisos
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isRoleModalOpen && (
        <RoleModal
          isOpen={isRoleModalOpen}
          onClose={handleCloseRoleModal}
          role={isCreatingRole ? null : selectedRole}
          onSubmit={isCreatingRole ? handleCreateRole : handleUpdateRole}
        />
      )}

      {selectedRole && modules && modules.length > 0 && (
        <PermissionEditor
          isOpen={isPermissionModalOpen}
          onClose={handleClosePermissionModal}
          role={selectedRole}
          modules={modules}
          onSubmit={handleUpdatePermission}
        />
      )}

      {/* Modal de acceso denegado */}
      <AccessDeniedModal
        isOpen={showAccessDenied}
        onClose={() => setShowAccessDenied(false)}
        title="Permisos Insuficientes"
        message="No tienes permisos para realizar esta acción en la gestión de roles del sistema."
        action={accessDeniedAction}
        module="Gestión de Roles"
      />
    </div>
  );
};

export default RoleList;