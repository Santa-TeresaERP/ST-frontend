"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../app/components/ui/dialog";
import { Button } from "../../../app/components/ui/button";
import { Input } from "../../../app/components/ui/input";
import { Label } from "../../../app/components/ui/label";
import { User } from '@/modules/user-creations/types/user';
import { useUpdateUser } from '@/modules/user-creations/hook/useUsers';
import { z } from "zod";

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name || ""}
              onChange={handleInputChange}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleInputChange}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phonenumber">Número de Teléfono</Label>
            <Input
              id="phonenumber"
              name="phonenumber"
              type="text"
              value={formData.phonenumber || ""}
              onChange={handleInputChange}
            />
            {errors.phonenumber && <p className="text-red-500 text-sm">{errors.phonenumber}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dni">DNI</Label>
            <Input
              id="dni"
              name="dni"
              type="text"
              value={formData.dni || ""}
              onChange={handleInputChange}
            />
            {errors.dni && <p className="text-red-500 text-sm">{errors.dni}</p>}
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
        {showWarning && (
          <Dialog open={showWarning} onOpenChange={() => setShowWarning(false)}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Confirmar Cambios</DialogTitle>
              </DialogHeader>
              <div className="text-center py-8">
                <p className="text-gray-600">¿Estás seguro de que quieres guardar los cambios?</p>
                <div className="mt-4 flex justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowWarning(false)}>
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 ml-2"
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
