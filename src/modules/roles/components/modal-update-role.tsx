"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "../../../app/components/ui/dialog";
import { Button } from "../../../app/components/ui/button";
import { Input } from "../../../app/components/ui/input";
import { Label } from "../../../app/components/ui/label";
import { Role } from '@/modules/roles/types/roles';
import { roleSchema } from "@/modules/roles/schemas/rolValidation";
import { z } from 'zod';
import { Check, User, Edit3, AlertTriangle, X } from 'lucide-react';
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
        <DialogContent
          className="w-full max-w-[90%] sm:max-w-[600px] rounded-xl shadow-lg px-0 pb-6 pt-0"
        >

          {/* Header con degradado */}
          <div className="w-full bg-gradient-to-r from-green-600 to-green-500 rounded-t-xl px-6 py-4 flex items-center space-x-3">
            <User className="h-6 w-6 text-white" />
            <DialogTitle className="text-white text-2xl font-semibold">
              {role ? `Editar Rol - ${role.name}` : "Crear Nuevo Rol"}
            </DialogTitle>
          </div>

          {/* Contenido del formulario */}
          <form onSubmit={handleSubmit} className="space-y-6 px-4 sm:px-6 mt-6">
            <Card className="p-4 border border-gray-300 shadow-sm">
              <div className="space-y-4">
                {/* Nombre */}
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
                    className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                  />
                  {errors.name && (
                    <div className="flex items-center text-red-500 text-sm mt-1">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.name}
                    </div>
                  )}
                </div>

                {/* Descripción */}
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
                    className={`w-full p-3 border ${errors.description ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
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

            {/* Footer con botones */}
            <DialogFooter className="flex flex-row justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full border-gray-400 text-gray-700 hover:bg-gray-100 rounded-3xl px-5"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className=" w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-md rounded-3xl px-5"
              >
                <Check className="h-4 w-4 mr-2" />
                {role ? "Actualizar Rol" : "Crear Rol"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RoleModal;
