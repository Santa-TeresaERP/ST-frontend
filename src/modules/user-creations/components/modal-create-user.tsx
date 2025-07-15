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
    return <div>Loading...</div>;
  }

  if (errorRoles) {
    return <div>Error loading data</div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[600px] p-0 overflow-hidden rounded-2xl shadow-xl">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-red-600 to-red-700 py-6 px-6">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-white flex items-center justify-center gap-3">
            <UserPlus className="w-10 h-10 text-white" />
            Crear Usuario
          </DialogTitle>
        </DialogHeader>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
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
        <div className="space-y-1 relative z-50">
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

        {/* Botones */}
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
            className="bg-red-700 hover:bg-red-600 text-white w-full sm:w-auto flex items-center gap-2"
          >
            <Save size={18} />
            Crear
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
  );    
};

export default Modal;