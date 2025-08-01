"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../app/components/ui/dialog";
import { Button } from "../../../app/components/ui/button";
import { Input } from "../../../app/components/ui/input";
import { Label } from "../../../app/components/ui/label";
import { User } from '@/modules/user-creations/types/user';
import { useUpdateUser } from '@/modules/user-creations/hook/useUsers';
import { z } from "zod";
import { Save, UserCog } from "lucide-react";

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
        setShowWarning(false); // Cierra el modal de confirmación
        onClose(); // Cierra el modal principal
      } catch (error) {
        console.error("Error updating user:", error);
        // Aquí podrías agregar un estado para mostrar un mensaje de error al usuario
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* DialogContent principal:
          - h-[90vh]: Establece una altura máxima del 90% del viewport height.
          - flex flex-col: Convierte el DialogContent en un contenedor flexbox vertical.
          - p-0: Elimina el padding por defecto para que el contenido interno controle su propio espaciado.
          - overflow-hidden: Asegura que el scroll se maneje internamente por los hijos flex.
      */}
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[600px] h-[90vh] flex flex-col p-0 rounded-2xl shadow-xl [&>button]:text-white [&>button]:hover:text-white">
        {/* Header: flex-shrink-0 para que no se encoja y siempre sea visible */}
        <div className="w-full bg-gradient-to-r from-green-600 to-green-700 py-6 px-6 flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-white flex items-center justify-center gap-3">
              <UserCog className="w-10 h-10 text-white" />
              Editar Usuario
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Formulario:
            - flex-1: Permite que el formulario crezca y ocupe el espacio restante verticalmente.
            - overflow-y-auto: Habilita el scroll vertical si el contenido del formulario excede su altura disponible.
            - p-6: Añade el padding interno al formulario.
            - id="edit-user-form": Se añade un ID para asociar el botón de submit externo.
        */}
        <form onSubmit={handleSubmit} id="edit-user-form" className="flex-1 overflow-y-auto p-6 flex flex-col space-y-6">
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

            {/* Email */}
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
                Teléfono
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
          {/* Aquí podrías añadir más campos si los tienes y necesitan scroll */}
        </form>

        {/* Footer: flex-shrink-0 para que no se encoja y siempre sea visible */}
        <DialogFooter className="pt-6 px-6 pb-6 flex justify-end gap-4 flex-shrink-0">
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
            form="edit-user-form" 
            className="bg-green-600 hover:bg-green-500 text-white w-full sm:w-auto flex items-center gap-2"
          >
            <Save size={18} />
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>

      <Dialog open={showWarning} onOpenChange={() => setShowWarning(false)}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[400px] flex flex-col p-0 rounded-2xl shadow-xl">
          {/* Header rojo */}
          <div className="w-full bg-gradient-to-r from-red-600 to-red-700 py-4 px-6 flex-shrink-0">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-white text-center">
                Confirmar Cambios
              </DialogTitle>
            </DialogHeader>
          </div>

          {/* Contenido */}
          <div className="text-center py-6 px-6 flex-1 overflow-y-auto">
            <p className="text-gray-700 mb-4">
              ¿Estás seguro de que quieres guardar los cambios?
            </p>
          </div>

          {/* Footer de confirmación */}
          <DialogFooter className="pt-6 px-6 pb-6 flex justify-center gap-4 flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowWarning(false)}
              className="text-gray-700 border-gray-400 hover:bg-gray-100"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmSubmit}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default UserModal;
