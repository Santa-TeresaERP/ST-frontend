"use client";

import React, { useState } from "react";
import { useFetchRoles, useCreateRole, useUpdateRole } from "@/modules/roles/hook/useRoles";
import { useUpdatePermission } from "@/modules/roles/hook/usePermissions";
import { useFetchModules } from "@/modules/modules/hook/useModules";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { UserIcon } from 'lucide-react';
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
        await updateRoleMutation.mutateAsync({ id: data.id, payload: { name: data.name, description: data.description } });
        queryClient.invalidateQueries({ queryKey: ['roles'] });
      } else {
        console.error('Role ID is undefined');
      }
      handleCloseRoleModal();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleUpdatePermission = async (data: { id: string; permissions: { moduleId: string; canRead: boolean; canWrite: boolean; canUpdate: boolean; canDelete: boolean }[] }) => {
    try {
      await updatePermissionMutation.mutateAsync({ id: data.id, payload: { permissions: data.permissions } });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      handleClosePermissionModal();
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold mb-6 text-center">Listado de Roles</h2>
        <Button onClick={() => { setIsCreatingRole(true); setIsRoleModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
          Crear Rol
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles && roles.map((role) => (
          <Card key={role.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-red-600 h-1/2 flex items-center justify-center">
              <CardTitle className="text-pink-200 text-2xl text-center flex items-center justify-between w-full px-4">
                {role.name}
                <UserIcon className="h-6 w-6 text-pink-200" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col items-center justify-center text-center">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xl">Descripción del Rol</Label>
                  <p className="text-lg">{role.description}</p>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  <Button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditRoleClick(role);
                    }}
                  >
                    Editar Rol
                  </Button>
                  <Button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditPermissionClick(role);
                    }}
                  >
                    Editar Permisos
                  </Button>
                </div>
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
      {selectedRole && modules && (
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