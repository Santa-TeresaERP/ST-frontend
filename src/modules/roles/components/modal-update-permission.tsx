"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../app/components/ui/dialog";
import { Button } from "../../../app/components/ui/button";
import { Input } from "../../../app/components/ui/input";
import { Label } from "../../../app/components/ui/label";
import { Role } from "@/modules/roles/types/roles";

type PermissionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  onSubmit: (data: { id: string; permissions: { canRead: boolean; canWrite: boolean; canUpdate: boolean; canDelete: boolean } }) => Promise<void>;
};

const PermissionModal: React.FC<PermissionModalProps> = ({ isOpen, onClose, role, onSubmit }) => {
  const [formData, setFormData] = useState<{ canRead: boolean; canWrite: boolean; canUpdate: boolean; canDelete: boolean }>({
    canRead: false,
    canWrite: false,
    canUpdate: false,
    canDelete: false,
  });

  useEffect(() => {
    if (role && role.permissions) {
      console.log("Permission data loaded into modal:", role);
      setFormData({
        canRead: role.permissions.canRead || false,
        canWrite: role.permissions.canWrite || false,
        canUpdate: role.permissions.canUpdate || false,
        canDelete: role.permissions.canDelete || false,
      });
    } else {
      setFormData({
        canRead: false,
        canWrite: false,
        canUpdate: false,
        canDelete: false,
      });
    }
  }, [role]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role?.id) {
      try {
        console.log("Updating permission with data:", formData);
        const payload = {
          id: role.id,
          permissions: formData,
        };
        await onSubmit(payload);
        console.log("Permission updated successfully");
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
            <Label htmlFor="canRead">Leer</Label>
            <Input id="canRead" name="canRead" type="checkbox" checked={formData.canRead} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="canWrite">Escribir</Label>
            <Input id="canWrite" name="canWrite" type="checkbox" checked={formData.canWrite} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="canUpdate">Actualizar</Label>
            <Input id="canUpdate" name="canUpdate" type="checkbox" checked={formData.canUpdate} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="canDelete">Eliminar</Label>
            <Input id="canDelete" name="canDelete" type="checkbox" checked={formData.canDelete} onChange={handleInputChange} />
          </div>
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
