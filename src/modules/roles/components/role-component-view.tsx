"use client";

import React, { useState } from "react";
import { useFetchRoles, useCreateRole, useUpdateRole } from "@/modules/roles/hook/useRoles";
import { useUpdatePermission } from "@/modules/roles/hook/usePermissions";
import { useFetchModules } from "@/modules/modules/hook/useModules";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { UserIcon, PlusCircle, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Role } from "@/modules/roles/types/roles";
import RoleModal from './modal-update-role';
import PermissionModal from './modal-update-permission';
import { Button } from "@/app/components/ui/button";
import { useQueryClient } from '@tanstack/react-query';

const RoleList: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: roles, isLoading, error } = useFetchRoles();
  const { data: modules } = useFetchModules();
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const updatePermissionMutation = useUpdatePermission();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreatingRole, setIsCreatingRole] = useState(false);

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
      await createRoleMutation.mutateAsync(data);
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      handleCloseRoleModal();
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  const handleUpdateRole = async (data: { id?: string; name: string; description: string }) => {
    try {
      if (data.id) {
        await updateRoleMutation.mutateAsync({ 
          id: data.id, 
          payload: { name: data.name, description: data.description } 
        });
        queryClient.invalidateQueries({ queryKey: ['roles'] });
      }
      handleCloseRoleModal();
    } catch (error) {
      console.error('Error updating role:', error);
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
      await updatePermissionMutation.mutateAsync({ 
        id: data.id, 
        payload: { permissions: data.permissions } 
      });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      handleClosePermissionModal();
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <ShieldCheck className="h-10 w-10 text-green-600 mb-4" />
        <p className="text-lg">Cargando roles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-gray-100 p-6 rounded-lg max-w-md text-center">
          <ShieldAlert className="h-10 w-10 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Error al cargar los roles</h2>
          <p className="text-gray-600">{error.message}</p>
          <Button className="mt-4 bg-red-600 hover:bg-red-700 text-white" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div className="flex items-center mb-4 sm:mb-0">
          <ShieldCheck className="h-8 w-8 text-red-700 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">Gestión de Roles</h2>
        </div>
        <Button onClick={() => { setIsCreatingRole(true); setIsRoleModalOpen(true); }} className="bg-green-600 hover:bg-green-500 text-white shadow-md flex items-center mt-6 rounded-3xl">
          <PlusCircle className="mr-2 h-5 w-5" />
          Crear Nuevo Rol
        </Button>
      </div>

      {roles && roles.length === 0 && (
        <div className="bg-gray-100 p-6 rounded-xl text-center max-w-md mx-auto">
          <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay roles creados</h3>
          <p className="text-gray-500 mb-4">Crea tu primer rol para gestionar permisos.</p>
          <Button onClick={() => { setIsCreatingRole(true); setIsRoleModalOpen(true); }} className="bg-green-600 hover:bg-green-500 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Rol
          </Button>
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
                <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50 rounded-3xl" onClick={() => handleEditRoleClick(role)}>
                  Editar
                </Button>
                <Button className="bg-green-600 hover:bg-green-500 text-white rounded-3xl" onClick={() => handleEditPermissionClick(role)}>
                  Permisos
                </Button>
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
        <PermissionModal
          isOpen={isPermissionModalOpen}
          onClose={handleClosePermissionModal}
          role={selectedRole}
          modules={modules}
          onSubmit={handleUpdatePermission}
        />
      )}
    </div>
  );
};

export default RoleList;