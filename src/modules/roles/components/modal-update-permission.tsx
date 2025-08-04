"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../app/components/ui/dialog";
import { Button } from "../../../app/components/ui/button";
import { Label } from "../../../app/components/ui/label";
import { Role } from "@/modules/roles/types/roles";
import { Module } from "@/modules/modules/types/modules";
import { Check, ChevronDown, Lock, Shield, ShieldCheck, ShieldHalf, Trash2 } from 'lucide-react';
import { Card } from "../../../app/components/ui/card";
import { useFetchPermissionsByRole } from "../hook/usePermissions";

type PermissionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  modules: Module[];
  onSubmit: (data: { id: string; permissions: { moduleId: string; canRead: boolean; canWrite: boolean; canUpdate: boolean; canDelete: boolean }[] }) => Promise<void>;
};

const PermissionModal: React.FC<PermissionModalProps> = ({ isOpen, onClose, role, modules, onSubmit }) => {
  const [formData, setFormData] = useState<{ [moduleId: string]: { canRead: boolean; canWrite: boolean; canUpdate: boolean; canDelete: boolean } }>({});
  const [originalPermissions, setOriginalPermissions] = useState<{ [moduleId: string]: { canRead: boolean; canWrite: boolean; canUpdate: boolean; canDelete: boolean } }>({});
  const [modifiedModules, setModifiedModules] = useState<Set<string>>(new Set());
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // 🆕 NUEVO: Obtener permisos existentes del backend
  const { data: existingPermissions, isLoading: isLoadingPermissions, error: permissionsError } = useFetchPermissionsByRole(role?.id || null);

  // Reset del modal cuando se abra
  useEffect(() => {
    if (isOpen && role) {
      console.log('🔄 Modal abierto, reseteando estado...', {
        roleId: role.id,
        roleName: role.name
      });
      setSelectedModule('');
      setShowConfirmation(false);
    }
  }, [isOpen, role]);

  useEffect(() => {
    console.log('🔄 Inicializando permisos del modal...', {
      role: role?.name,
      roleId: role?.id,
      modules: modules.length,
      existingPermissions: existingPermissions?.length || 0,
      isLoadingPermissions,
      permissionsError: permissionsError?.message,
      existingPermissionsData: existingPermissions
    });

    // Reset del selectedModule cuando cambia el rol
    if (role?.id && !selectedModule && modules.length > 0) {
      console.log('🔄 Auto-seleccionando primer módulo:', modules[0].name);
      setSelectedModule(modules[0].id);
    }

    if (isLoadingPermissions) {
      console.log('⏳ Cargando permisos desde el backend...');
      return;
    }

    if (permissionsError) {
      console.error('❌ Error cargando permisos:', permissionsError);
      return;
    }

    // Inicializar formData con todos los módulos
    const initialFormData: { [moduleId: string]: { canRead: boolean; canWrite: boolean; canUpdate: boolean; canDelete: boolean } } = {};
    
    modules.forEach((module) => {
      // Buscar permisos existentes para este módulo
      const existingPermission = existingPermissions?.find(p => p.moduleId === module.id);
      
      initialFormData[module.id] = {
        canRead: existingPermission?.canRead || false,
        canWrite: existingPermission?.canWrite || false,
        canUpdate: existingPermission?.canUpdate || false, // Ya convertido desde canEdit
        canDelete: existingPermission?.canDelete || false,
      };
      
      if (existingPermission) {
        console.log(`📋 Módulo ${module.name} (${module.id}):`, {
          canRead: existingPermission.canRead,
          canWrite: existingPermission.canWrite,
          canUpdate: existingPermission.canUpdate,
          canDelete: existingPermission.canDelete
        });
      }
    });

    console.log('✅ FormData inicializado:', initialFormData);
    setFormData(initialFormData);
    setOriginalPermissions(initialFormData); // Guardar estado original para comparar cambios
    setModifiedModules(new Set()); // Resetear módulos modificados

    // Auto-seleccionar el primer módulo si no hay ninguno seleccionado
    if (!selectedModule && modules.length > 0) {
      setSelectedModule(modules[0].id);
    }
  }, [role, modules, existingPermissions, isLoadingPermissions, selectedModule, permissionsError]);

  const handleInputChange = (permissionType: string, value: boolean) => {
    console.log('🔄 Cambiando permiso:', {
      module: selectedModule,
      permission: permissionType,
      value,
      moduleName: modules.find(m => m.id === selectedModule)?.name
    });

    const updatedData = {
      ...formData,
      [selectedModule]: {
        ...formData[selectedModule],
        [permissionType]: value,
      },
    };

    setFormData(updatedData);

    // Verificar si el módulo ha sido modificado comparando con el estado original
    const original = originalPermissions[selectedModule];
    const current = updatedData[selectedModule];
    const hasChanged = original && (
      original.canRead !== current.canRead ||
      original.canWrite !== current.canWrite ||
      original.canUpdate !== current.canUpdate ||
      original.canDelete !== current.canDelete
    );

    setModifiedModules(prev => {
      const newSet = new Set(prev);
      if (hasChanged) {
        newSet.add(selectedModule);
        console.log('✅ Módulo marcado como modificado:', selectedModule);
      } else {
        newSet.delete(selectedModule);
        console.log('🔄 Módulo restablecido al estado original:', selectedModule);
      }
      console.log('📊 Total de módulos modificados:', newSet.size);
      return newSet;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    if (role?.id) {
      try {
        // 🔥 CRITICAL FIX: Solo enviar módulos que han sido modificados
        console.log('📊 Estado completo antes de enviar:', {
          formData,
          originalPermissions,
          modifiedModules: Array.from(modifiedModules)
        });

        // Solo incluir módulos que han sido modificados
        const changedPermissions = Array.from(modifiedModules).map(moduleId => ({
          moduleId,
          ...formData[moduleId]
        }));

        if (changedPermissions.length === 0) {
          console.log('⚠️ No hay cambios para enviar');
          setShowConfirmation(false);
          onClose();
          return;
        }
        
        const payload = {
          id: role.id,
          permissions: changedPermissions
        };

        console.log('🚀 Payload enviado al backend (solo módulos modificados):', payload);
        console.log('📋 Total de módulos modificados:', payload.permissions.length);
        
        await onSubmit(payload);
        setShowConfirmation(false);
        onClose();
      } catch (error) {
        console.error("Error updating permission:", error);
      }
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-[90%] sm:max-w-[600px] rounded-xl shadow-lg px-0 pb-6 pt-0">

          {/* Header con degradado */}
          <div className="w-full bg-gradient-to-r from-green-600 to-green-500 rounded-t-xl px-6 py-4 flex items-center space-x-3">
            <ShieldCheck className="h-6 w-6 text-white" />
            <DialogTitle className="text-xl font-semibold text-white">
              {role ? `Editar Permisos - ${role.name}` : "Asignar Nuevos Permisos"}
            </DialogTitle>
          </div>

          {/* 🆕 Indicador de módulos modificados */}
          {modifiedModules.size > 0 && (
            <div className="mx-4 mt-2 mb-0 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-700">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="text-sm font-medium">
                  {modifiedModules.size} módulo{modifiedModules.size !== 1 ? 's' : ''} modificado{modifiedModules.size !== 1 ? 's' : ''}:
                </span>
                <span className="text-sm">
                  {Array.from(modifiedModules).map(moduleId => 
                    modules.find(m => m.id === moduleId)?.name || moduleId
                  ).join(', ')}
                </span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6 py-4 px-4 sm:px-6">
            {/* 🆕 Indicador de carga */}
            {isLoadingPermissions && (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                  <span>Cargando permisos existentes...</span>
                </div>
              </div>
            )}

            {/* 🆕 Indicador de error */}
            {permissionsError && (
              <div className="flex items-center justify-center py-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <span className="text-red-600">Error cargando permisos: {permissionsError.message}</span>
                </div>
              </div>
            )}

            {!isLoadingPermissions && !permissionsError && (
              <Card className="p-4 border border-gray-400 shadow-sm">
                <div className="space-y-4">
                  {/* 🆕 Resumen de permisos modificados */}
                  {Object.keys(formData).some(moduleId => 
                    Object.values(formData[moduleId]).some(permission => permission)
                  ) && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <ShieldCheck className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-800">
                          Módulos con permisos asignados:
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(formData)
                          .filter(moduleId => 
                            Object.values(formData[moduleId]).some(permission => permission)
                          )
                          .map(moduleId => {
                            const moduleName = modules.find(m => m.id === moduleId)?.name;
                            const permissions = formData[moduleId];
                            const activePermissions = Object.entries(permissions)
                              .filter(([, value]) => value)
                              .map(([key]) => key.replace('can', ''))
                              .join(', ');
                            
                            return (
                              <div key={moduleId} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                {moduleName}: {activePermissions}
                              </div>
                            );
                          })
                        }
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="flex items-center text-sm font-medium text-gray-700">
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Seleccionar Módulo
                    </Label>
                    <select
                      id="module"
                      name="module"
                      value={selectedModule}
                      onChange={(e) => {
                        console.log('📋 Cambiando a módulo:', e.target.value);
                        setSelectedModule(e.target.value);
                      }}
                      required
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-black"
                    >
                      <option value="">Seleccione un módulo</option>
                      {modules.map((module) => (
                        <option key={module.id} value={module.id}>
                          {module.name}
                        </option>
                      ))}
                    </select>
                  </div>

                {selectedModule && (
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center p-3 bg-gray-100 rounded-lg">
                      <Lock className="h-5 w-5 text-gray-600 mr-3" />
                      <span className="font-medium text-black">
                        Permisos del módulo: {modules.find(m => m.id === selectedModule)?.name}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {[ 
                        { id: 'canRead', label: 'Leer', icon: <Shield className="h-5 w-5 text-green-500 mr-3" /> },
                        { id: 'canWrite', label: 'Escribir', icon: <ShieldHalf className="h-5 w-5 text-blue-500 mr-3" /> },
                        { id: 'canUpdate', label: 'Actualizar', icon: <ShieldCheck className="h-5 w-5 text-purple-500 mr-3" /> },
                        { id: 'canDelete', label: 'Eliminar', icon: <Trash2 className="h-5 w-5 text-red-500 mr-3" /> },
                      ].map((perm) => (
                        <div key={perm.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-200 transition-colors">
                          <div className="flex items-center">
                            {perm.icon}
                            <Label htmlFor={`${perm.id}-${selectedModule}`} className="font-medium">
                              {perm.label}
                            </Label>
                          </div>
                          <input
                            id={`${perm.id}-${selectedModule}`}
                            type="checkbox"
                            checked={formData[selectedModule]?.[perm.id as keyof typeof formData[typeof selectedModule]] || false}
                            onChange={(e) => handleInputChange(perm.id, e.target.checked)}
                            className="h-5 w-5 rounded border-gray-400 text-green-600 focus:ring-green-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              </Card>
            )}

            <DialogFooter className="border-t flex flex-row  gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="w-full border-gray-400 text-gray-700 hover:bg-gray-200"
                disabled={isLoadingPermissions}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className={`w-full shadow-lg ${
                  modifiedModules.size > 0 
                    ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white' 
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
                disabled={isLoadingPermissions || modifiedModules.size === 0}
              >
                <Check className="h-4 w-4 mr-2" />
                {modifiedModules.size > 0 ? `Guardar ${modifiedModules.size} cambio${modifiedModules.size !== 1 ? 's' : ''}` : 'Sin cambios'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmación */}
      {showConfirmation && (
        <Dialog open={showConfirmation} onOpenChange={() => setShowConfirmation(false)}>
          <DialogContent className="w-full max-w-[90%] sm:max-w-[425px] rounded-xl shadow-lg px-0 pb-6 pt-0">

            <DialogHeader className="border-b pb-4">
              <div className="flex items-center space-x-3 px-4 py-4 justify-center">
                <ShieldCheck className="h-6 w-6 text-green-600" />
                <DialogTitle className="text-xl font-semibold text-black">
                  Confirmar Cambios
                </DialogTitle>
              </div>
            </DialogHeader>

            <div className="space-y-4  px-4 sm:px-6">
              <p className="text-gray-600">
                ¿Estás seguro de que deseas actualizar los permisos para estos módulos?
              </p>
              
              {/* Lista de módulos modificados */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-800">
                      Se actualizarán {modifiedModules.size} módulo{modifiedModules.size !== 1 ? 's' : ''}:
                    </p>
                    <ul className="mt-1 text-sm text-blue-700">
                      {Array.from(modifiedModules).map(moduleId => (
                        <li key={moduleId} className="flex items-center space-x-2">
                          <span>•</span>
                          <span>{modules.find(m => m.id === moduleId)?.name || moduleId}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 border-l-4 border-gray-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">
                      Los permisos de otros módulos no se verán afectados y se mantendrán tal como están.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="flex flex-row gap-4 pt-4 px-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowConfirmation(false)}
                className="w-full border-gray-400 text-gray-700 hover:bg-gray-200"
              >
                Revisar de nuevo
              </Button>
              <Button 
                type="button" 
                onClick={handleConfirmSubmit}
                className=" w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg"
              >
                <Check className="h-4 w-4 mr-2" />
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default PermissionModal;