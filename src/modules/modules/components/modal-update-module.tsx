"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../app/components/ui/dialog";
import { Button } from "../../../app/components/ui/button";
import { Input } from "../../../app/components/ui/input";
import { Label } from "../../../app/components/ui/label";
import { Module } from '@/modules/modules/types/modules';


type ModuleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  module: Module | null;
  onSubmit: (data: Omit<Module, 'createdAt' | 'updatedAt'>) => Promise<void>;
};

const ModuleModal: React.FC<ModuleModalProps> = ({ isOpen, onClose, module, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<Module>>({});

  useEffect(() => {
    if (module) {
      console.log('Module data loaded into modal:', module);
      setFormData(module);
    }
  }, [module]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (module?.id) {
      try {
        console.log('Updating module with data:', formData);
        const payload = {
          name: formData.name || "",
          description: formData.description || "",
        };
        await onSubmit({ id: module.id, ...payload });
        console.log('Module updated successfully');
        onClose();
      } catch (error) {
        console.error('Error updating module:', error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{module ? "Editar Módulo" : "Crear Módulo"}</DialogTitle>
        </DialogHeader>
        {module ? (
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
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">¿Estás seguro de que quieres editar este módulo?</p>
            <div className="mt-4 flex justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="button" className="bg-red-600 hover:bg-red-700 ml-2" onClick={handleSubmit}>
                Eliminar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModuleModal;