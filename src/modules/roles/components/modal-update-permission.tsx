"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../app/components/ui/dialog";
import { Button } from "../../../app/components/ui/button";
import { Input } from "../../../app/components/ui/input";
import { Label } from "../../../app/components/ui/label";
import { Role } from "@/modules/roles/types/roles";
import { Module } from "@/modules/modules/types/modules";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        onClose();
      } catch (error) {
        console.error("Error updating permission:", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{role ? "Editar Permiso" : "Crear Permiso"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="module">Módulo</Label>
            <select
              id="module"
              name="module"
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
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
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor={`canRead-${selectedModule}`}>Leer</Label>
                <Input
                  id={`canRead-${selectedModule}`}
                  name={`canRead-${selectedModule}`}
                  type="checkbox"
                  checked={formData[selectedModule]?.canRead || false}
                  onChange={(e) => handleInputChange("canRead", e.target.checked)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor={`canWrite-${selectedModule}`}>Escribir</Label>
                <Input
                  id={`canWrite-${selectedModule}`}
                  name={`canWrite-${selectedModule}`}
                  type="checkbox"
                  checked={formData[selectedModule]?.canWrite || false}
                  onChange={(e) => handleInputChange("canWrite", e.target.checked)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor={`canUpdate-${selectedModule}`}>Actualizar</Label>
                <Input
                  id={`canUpdate-${selectedModule}`}
                  name={`canUpdate-${selectedModule}`}
                  type="checkbox"
                  checked={formData[selectedModule]?.canUpdate || false}
                  onChange={(e) => handleInputChange("canUpdate", e.target.checked)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor={`canDelete-${selectedModule}`}>Eliminar</Label>
                <Input
                  id={`canDelete-${selectedModule}`}
                  name={`canDelete-${selectedModule}`}
                  type="checkbox"
                  checked={formData[selectedModule]?.canDelete || false}
                  onChange={(e) => handleInputChange("canDelete", e.target.checked)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionModal;