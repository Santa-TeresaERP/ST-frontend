"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../app/components/ui/dialog";
import { Button } from "../../../app/components/ui/button";
import { Input } from "../../../app/components/ui/input";
import { Label } from "../../../app/components/ui/label";
import { Role } from '@/modules/roles/types/roles';

type RoleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  onSubmit: (data: { id?: string; name: string; description: string }) => Promise<void>;
};

const RoleModal: React.FC<RoleModalProps> = ({ isOpen, onClose, role, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<Role>>({});

  useEffect(() => {
    if (role) {
      console.log('Role data loaded into modal:', role);
      setFormData(role);
    } else {
      setFormData({ name: "", description: "" });
    }
  }, [role]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Submitting role data:', formData);
      await onSubmit(formData as { id?: string; name: string; description: string });
      console.log('Role submitted successfully');
      onClose();
    } catch (error) {
      console.error('Error submitting role:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{role ? "Editar Rol" : "Crear Rol"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" type="text" value={formData.name || ""} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input id="description" name="description" type="text" value={formData.description || ""} onChange={handleInputChange} />
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

export default RoleModal;