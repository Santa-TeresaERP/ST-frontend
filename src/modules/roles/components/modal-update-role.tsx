"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../app/components/ui/dialog";
import { Button } from "../../../app/components/ui/button";
import { Input } from "../../../app/components/ui/input";
import { Label } from "../../../app/components/ui/label";
import { Role } from '@/modules/roles/types/roles';
import { roleSchema } from "@/modules/roles/schemas/rolValidation";
import { z } from 'zod';
import { Check, User, Edit3, AlertTriangle } from 'lucide-react';
import { Card } from "../../../app/components/ui/card";

type RoleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  onSubmit: (data: { id?: string; name: string; description: string }) => Promise<void>;
};

const RoleModal: React.FC<RoleModalProps> = ({ isOpen, onClose, role, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<Role>>({ name: "", description: "" });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Role, string>>>({});

  useEffect(() => {
    if (role) {
      setFormData(role);
    } else {
      setFormData({ name: "", description: "" });
    }
    setErrors({});
  }, [role, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      roleSchema.parse(formData);
      setErrors({});
      setShowConfirmation(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof Role, string>> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as keyof Role] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  const handleConfirmSubmit = async () => {
    try {
      await onSubmit(formData as { id?: string; name: string; description: string });
      setShowConfirmation(false);
      onClose();
      setFormData({ name: "", description: "" });
    } catch (error) {
      console.error('Error submitting role:', error);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] rounded-lg">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center space-x-3">
              <User className="h-6 w-6 text-green-600" />
              <DialogTitle className="text-2xl font-semibold text-black">
                {role ? `Editar Rol - ${role.name}` : "Crear Nuevo Rol"}
              </DialogTitle>
            </div>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <Card className="p-4 border border-gray-400 shadow-sm">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Nombre del Rol
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-black`}
                  />
                  {errors.name && (
                    <div className="flex items-center text-red-500 text-sm mt-1">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.name}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="flex items-center text-sm font-medium text-gray-700">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Descripción
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    type="text"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    className={`w-full p-3 border ${errors.description ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-black`}
                  />
                  {errors.description && (
                    <div className="flex items-center text-red-500 text-sm mt-1">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.description}
                    </div>
                  )}
                </div>
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
                {role ? "Actualizar Rol" : "Crear Rol"}
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
                <User className="h-6 w-6 text-green-600" />
                <DialogTitle className="text-xl font-semibold text-black">
                  Confirmar Cambios
                </DialogTitle>
              </div>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-gray-600">
                ¿Estás seguro de que deseas {role ? "actualizar" : "crear"} este rol?
              </p>
              <div className="bg-gray-100 border-l-4 border-gray-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">
                      Esta acción afectará los permisos asociados a este rol.
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
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default RoleModal;