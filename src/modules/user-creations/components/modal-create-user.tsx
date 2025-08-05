"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../app/components/ui/dialog";
import { Button } from "../../../app/components/ui/button";
import { Input } from "../../../app/components/ui/input";
import { Label } from "../../../app/components/ui/label";
import { User } from '@/modules/user-creations/types/user';
import { useFetchRoles } from '@/modules/roles/hook/useRoles';
import { userSchema } from '@/modules/user-creations/schemas/userValidation';
import { z } from 'zod';
import { Save, UserPlus } from "lucide-react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<User, "createdAt" | "updatedAt"> & { password: string }) => void | Promise<void>;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const { data: roles, isLoading: isLoadingRoles, error: errorRoles } = useFetchRoles();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const formData: Record<string, unknown> = Object.fromEntries(data.entries());

    formData.roleId = selectedRole;

    // Validar los datos del formulario
    const result = userSchema.safeParse(formData);
    if (!result.success) {
      const validationErrors: Record<string, string> = {};
      result.error.errors.forEach((error: z.ZodIssue) => {
        if (error.path.length > 0) {
          validationErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData as Omit<User, "createdAt" | "updatedAt"> & { password: string });
  };

  if (isLoadingRoles) {
    return (
      <Dialog open={isOpen}> {/* Mantener el Dialog abierto mientras carga */}
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[600px] h-[30vh] flex items-center justify-center p-0 rounded-2xl shadow-xl">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <span className="mt-4 text-lg text-gray-700">Cargando roles...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (errorRoles) {
    return (
      <Dialog open={isOpen}> {/* Mantener el Dialog abierto para mostrar el error */}
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[600px] h-[30vh] flex items-center justify-center p-0 rounded-2xl shadow-xl">
          <div className="text-center text-red-600 p-4">
            <p className="text-lg font-semibold">Error al cargar datos</p>
            <p className="text-sm">Por favor, intente de nuevo más tarde.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* DialogContent:
          - h-[90vh]: Establece una altura máxima del 90% del viewport height.
          - flex flex-col: Convierte el DialogContent en un contenedor flexbox vertical.
          - p-0: Elimina el padding por defecto para que el contenido interno controle su propio espaciado.
          - overflow-hidden: Asegura que el DialogContent en sí no tenga scroll, y que el scroll lo manejen los hijos flex.
      */}
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[600px] h-[90vh] flex flex-col p-0 rounded-2xl shadow-xl">
        {/* Header: flex-shrink-0 para que no se encoja y siempre sea visible */}
        <div className="w-full bg-gradient-to-r from-red-600 to-red-700 py-6 px-6 flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-white flex items-center justify-center gap-3">
              <UserPlus className="w-10 h-10 text-white" />
              Crear Usuario
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Formulario:
            - flex-1: Permite que el formulario crezca y ocupe el espacio restante verticalmente.
            - overflow-y-auto: Habilita el scroll vertical si el contenido del formulario excede su altura disponible.
            - p-6: Añade el padding interno al formulario.
            - id="user-creation-form": Se añade un ID para asociar el botón de submit externo.
        */}
        <form onSubmit={handleSubmit} id="user-creation-form" className="flex-1 overflow-y-auto p-6 flex flex-col space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Nombre */}
            <div className="space-y-1">
              <Label htmlFor="name" className="uppercase font-semibold text-sm text-gray-700">Nombre</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                className={`border border-black rounded-md px-4 py-2 ${errors.name ? "border-red-600" : ""}`}
              />
              {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email" className="uppercase font-semibold text-sm text-gray-700">Correo Electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className={`border border-black rounded-md px-4 py-2 ${errors.email ? "border-red-600" : ""}`}
              />
              {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
            </div>

          {/* Teléfono */}
          <div className="space-y-1">
            <Label htmlFor="phonenumber" className="uppercase font-semibold text-sm text-gray-700">Número de Teléfono</Label>
            <Input
              id="phonenumber"
              name="phonenumber"
              type="text"
              required
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={9}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').slice(0, 9);
              }}
              className={`border border-black rounded-md px-4 py-2 ${errors.phonenumber ? "border-red-600" : ""}`}
            />
          {errors.phonenumber && <p className="text-red-600 text-sm">{errors.phonenumber}</p>}
          </div>

          {/* DNI */}
          <div className="space-y-1">
            <Label htmlFor="dni" className="uppercase font-semibold text-sm text-gray-700">DNI</Label>
            <Input
              id="dni"
              name="dni"
              type="text"
              required
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={8}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').slice(0, 8);
              }}
              className={`border border-black rounded-md px-4 py-2 ${errors.dni ? "border-red-600" : ""}`}
            />
            {errors.dni && <p className="text-red-600 text-sm">{errors.dni}</p>}
          </div>
        </div>

          {/* Contraseña */}
          <div className="space-y-1">
            <Label htmlFor="password" className="uppercase font-semibold text-sm text-gray-700">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className={`border border-black rounded-md px-4 py-2 ${errors.password ? "border-red-600" : ""}`}
            />
            {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
          </div>

          {/* Separador */}
          <hr className="my-4 border-t-2 border-gray-300" />

          {/* Rol */}
          <div className="space-y-1 relative z-10"> {/* z-10 para asegurar que el select no sea cortado por el overflow del padre */}
            <Label htmlFor="role" className="uppercase font-semibold text-sm text-gray-700">Rol</Label>
            <select
              id="role"
              name="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              required
              className={`w-full px-4 py-2 border rounded-md text-sm bg-white focus:outline-none ${
                errors.roleId ? "border-red-600" : "border-black"
              }`}
            >
              <option value="">Seleccione un rol</option>
              {roles?.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.roleId && <p className="text-red-600 text-sm">{errors.roleId}</p>}
          </div>

          {/* El DialogFooter se moverá fuera del form para que siempre esté visible y no se desplace con el contenido */}
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
            form="user-creation-form" // Usa el ID del formulario para que este botón lo envíe
            className="bg-red-700 hover:bg-red-600 text-white w-full sm:w-auto flex items-center gap-2"
          >
            <Save size={18} />
            Crear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;