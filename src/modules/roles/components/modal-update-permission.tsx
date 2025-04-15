"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../app/components/ui/dialog";
import { Button } from "../../../app/components/ui/button";
import { Label } from "../../../app/components/ui/label";
import { Role } from "@/modules/roles/types/roles";
import { Module } from "@/modules/modules/types/modules";
import { Check, ChevronDown, Lock, Shield, ShieldCheck, ShieldHalf, Trash2 } from 'lucide-react';
import { Card } from "../../../app/components/ui/card";

type PermissionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  modules: Module[];
  onSubmit: (data: { id: string; permissions: { moduleId: string; canRead: boolean; canWrite: boolean; canUpdate: boolean; canDelete: boolean }[] }) => Promise<void>;
};

const PermissionModal: React.FC<PermissionModalProps> = ({ isOpen, onClose, role, modules, onSubmit }) => {
  const [formData, setFormData] = useState<{ [moduleId: string]: { canRead: boolean; canWrite: boolean; canUpdate: boolean; canDelete: boolean } }>({});
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (role && role.permissions) {
      const initialFormData: { [moduleId: string]: { canRead: boolean; canWrite: boolean; canUpdate: boolean; canDelete: boolean } } = {};
      modules.forEach((module) => {
        initialFormData[module.id] = {
          canRead: role.permissions[module.id]?.canRead || false,
          canWrite: role.permissions[module.id]?.canWrite || false,
          canUpdate: role.permissions[module.id]?.canUpdate || false,
          canDelete: role.permissions[module.id]?.canDelete || false,
        };
      });
      setFormData(initialFormData);
    } else {
      const initialFormData: { [moduleId: string]: { canRead: boolean; canWrite: boolean; canUpdate: boolean; canDelete: boolean } } = {};
      modules.forEach((module) => {
        initialFormData[module.id] = {
          canRead: false,
          canWrite: false,
          canUpdate: false,
          canDelete: false,
        };
      });
      setFormData(initialFormData);
    }
  }, [role, modules]);

  const handleInputChange = (permissionType: string, value: boolean) => {
    setFormData({
      ...formData,
      [selectedModule]: {
        ...formData[selectedModule],
        [permissionType]: value,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    if (role?.id) {
      try {
        const payload = {
          id: role.id,
          permissions: Object.keys(formData).map(moduleId => ({
            moduleId,
            ...formData[moduleId]
          }))
        };
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
        <DialogContent className="sm:max-w-[600px] rounded-lg">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="h-6 w-6 text-green-600" />
              <DialogTitle className="text-2xl font-semibold text-black">
                {role ? `Editar Permisos - ${role.name}` : "Asignar Nuevos Permisos"}
              </DialogTitle>
            </div>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <Card className="p-4 border border-gray-400 shadow-sm">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center text-sm font-medium text-gray-700">
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Seleccionar Módulo
                  </Label>
                  <select
                    id="module"
                    name="module"
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
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

            <DialogFooter className="border-t pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="border-gray-400 text-gray-700 hover:bg-gray-200"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg"
              >
                <Check className="h-4 w-4 mr-2" />
                Guardar Permisos
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmación */}
      {showConfirmation && (
        <Dialog open={showConfirmation} onOpenChange={() => setShowConfirmation(false)}>
          <DialogContent className="sm:max-w-[425px] rounded-lg">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="h-6 w-6 text-green-600" />
                <DialogTitle className="text-xl font-semibold text-black">
                  Confirmar Cambios
                </DialogTitle>
              </div>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-gray-600">
                ¿Estás seguro de que deseas {role ? "actualizar" : "asignar"} estos permisos?
              </p>
              <div className="bg-gray-100 border-l-4 border-gray-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">
                      Esta acción afectará los permisos de todos los usuarios con este rol.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="border-t pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowConfirmation(false)}
                className="border-gray-400 text-gray-700 hover:bg-gray-200"
              >
                Revisar de nuevo
              </Button>
              <Button 
                type="button" 
                onClick={handleConfirmSubmit}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg"
              >
                <Check className="h-4 w-4 mr-2" />
                Confirmar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default PermissionModal;