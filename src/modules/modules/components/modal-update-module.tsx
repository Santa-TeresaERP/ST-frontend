"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../app/components/ui/dialog";
import { Button } from "../../../app/components/ui/button";
import { Input } from "../../../app/components/ui/input";
import { Label } from "../../../app/components/ui/label";
import { Module } from "@/modules/modules/types/modules";
import { moduleSchema } from "@/modules/modules/schemas/moduleValidation";
import { z } from "zod";
import { Save } from "lucide-react";

type ModuleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  module: Module | null;
  onSubmit: (data: Omit<Module, "createdAt" | "updatedAt">) => Promise<void>;
};

const ModuleModal: React.FC<ModuleModalProps> = ({
  isOpen,
  onClose,
  module,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Partial<Module>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof Module, string>>
  >({});

  useEffect(() => {
    if (module) {
      setFormData(module);
    } else {
      setFormData({ name: "", description: "" });
    }
    setErrors({});
  }, [module, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      moduleSchema.parse(formData);
      setErrors({});
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
        console.error("Error updating module:", error);
      }
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-[90%] sm:max-w-[425px] px-4 py-6 mx-auto rounded-lg shadow-md">
          {/* Header ocupa todo el ancho */}
          <div className="-mt-6 -mx-4 rounded-t-lg bg-gradient-to-r from-red-700 via-red-600 to-red-500 px-6 py-4">
            <DialogTitle className="text-white text-2xl sm:text-3xl font-bold text-center">
              {module ? "Editar Módulo" : "Crear Módulo"}
            </DialogTitle>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-red-800 font-semibold" htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name || ""}
                onChange={handleInputChange}
                className={`w-full ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-red-800 font-semibold" htmlFor="description">Descripción</Label>
              <Input
                id="description"
                name="description"
                type="text"
                value={formData.description || ""}
                onChange={handleInputChange}
                className={`w-full ${errors.description ? "border-red-500" : ""}`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>

            <DialogFooter className="flex flex-row sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto border border-red-700 rounded-3xl text-red-800 hover:bg-red-100"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-600 text-white w-full rounded-3xl sm:w-auto flex items-center gap-2"
              >
                <Save size={18} />
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {showConfirmation && (
        <Dialog open={showConfirmation} onOpenChange={() => setShowConfirmation(false)}>
          <DialogContent className="w-full max-w-[90%] sm:max-w-[425px] px-4 py-6 mx-auto rounded-lg shadow-md">
            <DialogHeader>
              <DialogTitle className="text-red-700 text-xl font-bold">Confirmación</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-700">
                ¿Estás seguro de que deseas {module ? "editar" : "crear"} este módulo?
              </p>
              <DialogFooter className="flex flex-row sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                  className="w-full border border-red-700 rounded-3xl text-red-800 hover:bg-red-100 px-4 py-2"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  className="w-full bg-red-700 hover:bg-red-600 text-white rounded-3xl flex items-center gap-2 px-4 py-2"
                  onClick={handleConfirmSubmit}
                >
                  <Save size={18} />
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
