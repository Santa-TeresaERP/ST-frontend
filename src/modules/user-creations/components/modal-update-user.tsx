"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../app/components/ui/dialog";
import { Button } from "../../../app/components/ui/button";
import { Input } from "../../../app/components/ui/input";
import { Label } from "../../../app/components/ui/label";
import { User } from '@/modules/user-creations/types/user';
import { useUpdateUser } from '@/modules/user-creations/hook/useUsers';
import { z } from "zod";
import { UserCog } from "lucide-react";

const userSchema = z.object({
  name: z
    .string()
    .max(45, "El nombre completo no debe exceder los 45 caracteres")
    .regex(
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
      "El nombre solo debe contener letras y espacios"
    ),
  dni: z
    .string()
    .length(8, "El DNI debe tener 8 dígitos")
    .regex(/^[0-9]+$/, "El DNI solo debe contener números"),
  phonenumber: z
    .string()
    .length(9, "El número telefónico debe tener 9 dígitos")
    .regex(/^[0-9]+$/, "El número telefónico solo debe contener números"),
  email: z.string().email("El email debe tener un formato válido"),
});

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
};

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user }) => {
  const [formData, setFormData] = useState<Partial<User>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mutateAsync: updateUser } = useUpdateUser();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" })); // Limpiar errores al modificar campos
  };

  const validateForm = () => {
    try {
      userSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowWarning(true);
    }
  };

  const handleConfirmSubmit = async () => {
    if (user?.id) {
      try {
        const payload = {
          name: formData.name || "",
          dni: formData.dni || "",
          phonenumber: formData.phonenumber?.toString() || "",
          email: formData.email || "",
        };
        await updateUser({ id: user.id.toString(), payload });
        onClose();
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-2xl shadow-xl px-6 py-4">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold flex items-center justify-center gap-3 text-gray-800">
            <UserCog className="w-10 h-10 text-red-600" />
            Editar Usuario
          </DialogTitle>
        </DialogHeader>
  
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Nombre */}
            <div className="space-y-1">
              <Label htmlFor="name" className="uppercase font-semibold text-sm text-gray-700">
                Nombre
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name || ""}
                onChange={handleInputChange}
                className={`border border-black rounded-md px-4 py-2 ${errors.name ? "border-red-600" : ""}`}
              />
              {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
            </div>
  
            {/* Correo */}
            <div className="space-y-1">
              <Label htmlFor="email" className="uppercase font-semibold text-sm text-gray-700">
                Correo Electrónico
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                className={`border border-black rounded-md px-4 py-2 ${errors.email ? "border-red-600" : ""}`}
              />
              {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
            </div>
  
            {/* Teléfono */}
            <div className="space-y-1">
              <Label htmlFor="phonenumber" className="uppercase font-semibold text-sm text-gray-700">
                Número de Teléfono
              </Label>
              <Input
                id="phonenumber"
                name="phonenumber"
                type="text"
                value={formData.phonenumber || ""}
                onChange={handleInputChange}
                className={`border border-black rounded-md px-4 py-2 ${errors.phonenumber ? "border-red-600" : ""}`}
              />
              {errors.phonenumber && <p className="text-red-600 text-sm">{errors.phonenumber}</p>}
            </div>
  
            {/* DNI */}
            <div className="space-y-1">
              <Label htmlFor="dni" className="uppercase font-semibold text-sm text-gray-700">
                DNI
              </Label>
              <Input
                id="dni"
                name="dni"
                type="text"
                value={formData.dni || ""}
                onChange={handleInputChange}
                className={`border border-black rounded-md px-4 py-2 ${errors.dni ? "border-red-600" : ""}`}
              />
              {errors.dni && <p className="text-red-600 text-sm">{errors.dni}</p>}
            </div>
          </div>
  
          {/* Footer de botones */}
          <DialogFooter className="pt-6 flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border border-gray-400 hover:bg-gray-100 text-gray-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md"
            >
              Guardar
            </Button>
          </DialogFooter>
        </form>
  
        {/* Confirmación */}
        {showWarning && (
          <Dialog open={showWarning} onOpenChange={() => setShowWarning(false)}>
            <DialogContent className="sm:max-w-[425px] rounded-2xl shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-center text-gray-800">
                  Confirmar Cambios
                </DialogTitle>
              </DialogHeader>
              <div className="text-center py-6 px-4">
                <p className="text-gray-600 mb-4">
                  ¿Estás seguro de que quieres guardar los cambios?
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowWarning(false)}
                    className="text-gray-700"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleConfirmSubmit}
                  >
                    Confirmar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
  
};

export default UserModal;
