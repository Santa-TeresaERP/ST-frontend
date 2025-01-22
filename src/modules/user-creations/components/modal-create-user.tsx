"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../app/components/ui/dialog";
import { Button } from "../../../app/components/ui/button";
import { Input } from "../../../app/components/ui/input";
import { Label } from "../../../app/components/ui/label";
import { User } from '@/app/lib/interfaces';
import { useFetchRoles } from '@/modules/roles/hook/useRoles';
import { userSchema } from '@/modules/auth/models/userValidation';
import { z } from 'zod';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<User, "createdAt" | "updatedAt">) => void;
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

    onSubmit(formData as Omit<User, "createdAt" | "updatedAt">);
  };

  if (isLoadingRoles) {
    return <div>Loading...</div>;
  }

  if (errorRoles) {
    return <div>Error loading data</div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Crear Usuario</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" type="text" required />
              {errors.name && <p className="text-red-600">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" name="email" type="email" required />
              {errors.email && <p className="text-red-600">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phonenumber">Número de Teléfono</Label>
              <Input id="phonenumber" name="phonenumber" type="text" required />
              {errors.phonenumber && <p className="text-red-600">{errors.phonenumber}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dni">DNI</Label>
              <Input id="dni" name="dni" type="text" required />
              {errors.dni && <p className="text-red-600">{errors.dni}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" name="password" type="password" required />
            {errors.password && <p className="text-red-600">{errors.password}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <select
              id="role"
              name="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Seleccione un rol</option>
              {roles?.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.roleId && <p className="text-red-600">{errors.roleId}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              Crear
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;