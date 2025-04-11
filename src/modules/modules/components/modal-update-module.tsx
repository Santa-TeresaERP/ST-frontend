"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../app/components/ui/dialog";
import { Button } from "../../../app/components/ui/button";
import { Input } from "../../../app/components/ui/input";
import { Label } from "../../../app/components/ui/label";
import { Module } from '@/modules/modules/types/modules';
import { moduleSchema } from "@/modules/modules/schemas/moduleValidation";
import { z } from 'zod';

type ModuleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  module: Module | null;
  onSubmit: (data: Omit<Module, 'createdAt' | 'updatedAt'>) => Promise<void>;
};

const ModuleModal: React.FC<ModuleModalProps> = ({ isOpen, onClose, module, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<Module>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Module, string>>>({});

  useEffect(() => {
    if (module) {
      setFormData(module);
    } else {
      setFormData({ name: "", description: "" });
    }
    setErrors({}); // Clear errors when the modal is opened or the module changes
  }, [module, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      moduleSchema.parse(formData);
      setErrors({}); // Clear validation errors if validation passes
      setShowConfirmation(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof Module, string>> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as keyof Module] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  const handleConfirmSubmit = async () => {
    if (module?.id) {
      try {
        const payload = {
          name: formData.name || "",
          description: formData.description || "",
        };
        await onSubmit({ id: module.id, ...payload });
        setShowConfirmation(false);
        onClose();
      } catch (error) {
        console.error('Error updating module:', error);
      }
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-red-800 border-b border-red-800 pb-2 mb-6">{module ? "Editar Módulo" : "Crear Módulo"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-red-800" htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name || ""}
                onChange={handleInputChange}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-red-800" htmlFor="description">Descripción</Label>
              <Input
                id="description"
                name="description"
                type="text"
                value={formData.description || ""}
                onChange={handleInputChange}
                className={errors.description ? 'border-red-500' : ''} 
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-red-800 hover:bg-red-700 text-white">
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {showConfirmation && (
        <Dialog open={showConfirmation} onOpenChange={() => setShowConfirmation(false)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-red-800">Confirmación</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>¿Estás seguro de que deseas {module ? "editar" : "crear"} este módulo?</p>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowConfirmation(false)}>
                  Cancelar
                </Button>
                <Button type="button" className="bg-red-800 hover:bg-red-700 text-white" onClick={handleConfirmSubmit}>
                  Confirmar
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ModuleModal;