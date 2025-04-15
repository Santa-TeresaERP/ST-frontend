"use client";

import React, { useState } from "react";
import { useFetchRoles, useCreateRole, useUpdateRole } from "@/modules/roles/hook/useRoles";
import { useUpdatePermission } from "@/modules/roles/hook/usePermissions";
import { useFetchModules } from "@/modules/modules/hook/useModules";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { UserIcon, PlusCircle, Loader2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Role } from "@/modules/roles/types/roles";
import RoleModal from './modal-update-role';
import PermissionModal from './modal-update-permission';
import { Button } from "@/app/components/ui/button";
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from "framer-motion";

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
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-12 w-12 text-gray-500" />
        </motion.div>
        <motion.p 
          className="mt-4 text-lg text-gray-600"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
        >
          Cargando roles...
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center min-h-screen p-4"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <div className="bg-gray-100 p-6 rounded-lg max-w-md text-center">
          <ShieldAlert className="h-10 w-10 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Error al cargar los roles</h2>
          <p className="text-gray-600">{error.message}</p>
          <Button 
            className="mt-4 bg-gray-700 hover:bg-gray-600 text-white"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-4 sm:mb-0">
          <ShieldCheck className="h-8 w-8 text-gray-600 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">
            Gestión de Roles
          </h2>
        </div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button 
            onClick={() => { setIsCreatingRole(true); setIsRoleModalOpen(true); }} 
            //Aqui se meustra el color de el boton 
            className="bg-green-600 hover:bg-green-500 text-white shadow-lg"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Nuevo Rol
          </Button>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {roles && roles.length === 0 && (
          <motion.div 
            className="text-3xl font-bold text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-gray-50 p-8 rounded-xl text-center max-w-md">
              <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay roles creados</h3>
              <p className="text-gray-500 mb-4">Comienza creando tu primer rol para gestionar permisos en la aplicación.</p>
              <Button 
                onClick={() => { setIsCreatingRole(true); setIsRoleModalOpen(true); }} 
                className="bg-green-600 hover:bg-green-500 text-white"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear Primer Rol
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {roles && roles.map((role) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
              layout
            >
              <Card 
                className={`relative overflow-hidden transition-all duration-300 ${hoveredCard === role.id ? 'shadow-lg ring-1 ring-gray-300' : 'shadow-md'}`}
                onMouseEnter={() => setHoveredCard(role.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-300"></div>
                
                {hoveredCard === role.id && (
                  <motion.div 
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      background: 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)',
                      opacity: 0.3 
                    }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                
                <CardHeader className="pb-2 relative z-10 bg-white">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-600 mr-2" />
                      {role.name}
                    </CardTitle>
                    <span className="inline-flex items-center rounded-md border border-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
                      ID: {role.id.substring(0, 4)}...
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="relative z-10 bg-white">
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Descripción</Label>
                      <p className="text-gray-700">{role.description || "Sin descripción"}</p>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Button
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-50 relative z-20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditRoleClick(role);
                          }}
                        >
                          Editar
                        </Button>
                      </motion.div>
                      
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Button
                          className="bg-green-600 hover:bg-green-500 text-white relative z-20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditPermissionClick(role);
                          }}
                        >
                          Permisos
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
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