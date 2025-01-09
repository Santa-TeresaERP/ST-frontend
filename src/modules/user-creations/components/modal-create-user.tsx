"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../app/components/ui/dialog";
import { Button } from "../../../app/components/ui/button";
import { Input } from "../../../app/components/ui/input";
import { Label } from "../../../app/components/ui/label";
import Checkbox from "../../../app/components/ui/checkbox";
import { User } from '@/app/lib/interfaces';

type ModuleKeys = 'administrativo' | 'ventas' | 'alquileres';
type PermissionKeys = 'misa' | 'reposteria' | 'manualidades' | 'santaCatalina' | 'goyoneche' | 'santaMarta' | 'usersgroups';

type ModulesState = {
  [key in ModuleKeys]: {
    [key in PermissionKeys]?: boolean;
  };
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<User, "createdAt" | "updatedAt">) => void; 
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [isAdmin, setIsAdmin] = useState(false); 
  const [modules, setModules] = useState<ModulesState>({
    administrativo: { usersgroups: false},
    ventas: { misa: false, reposteria: false, manualidades: false },
    alquileres: { santaCatalina: false, goyoneche: false, santaMarta: false },
  });

  const handleModuleChange = (module: ModuleKeys, permission: PermissionKeys) => {
    setModules((prevModules) => ({
      ...prevModules,
      [module]: {
        ...prevModules[module],
        [permission]: !prevModules[module][permission],
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const formData: Record<string, unknown> = Object.fromEntries(data.entries());

    formData.isadmin = isAdmin;
    formData.modules = modules; 
    onSubmit(formData as Omit<User, "createdAt" | "updatedAt">); 
  };

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
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phonenumber">Número de Teléfono</Label>
              <Input id="phonenumber" name="phonenumber" type="text" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dni">DNI</Label>
              <Input id="dni" name="dni" type="text" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isadmin"
              name="isadmin"
              checked={isAdmin}
              onCheckedChange={(checked) => setIsAdmin(checked)}
            />
            <Label htmlFor="isadmin">Administrador</Label>
          </div>
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Módulos</Label>
            <div className="grid grid-cols-3 gap-6">
              {/* Módulo Administrativo */}
              <div className="space-y-2">
                <h3 className="font-medium">Administrativo</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="admin-access"
                    name="admin-access"
                    checked={modules.administrativo.usersgroups}
                    onCheckedChange={() => handleModuleChange('administrativo', 'usersgroups')}
                  />
                  <Label htmlFor="admin-access">Usuarios y Grupos</Label>
                </div>
              </div>
              {/* Módulo Ventas */}
              <div className="space-y-2">
                <h3 className="font-medium">Ventas</h3>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ventas-misa"
                      name="ventas-misa"
                      checked={modules.ventas.misa}
                      onCheckedChange={() => handleModuleChange('ventas', 'misa')}
                    />
                    <Label htmlFor="ventas-misa">Misa</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ventas-reposteria"
                      name="ventas-reposteria"
                      checked={modules.ventas.reposteria}
                      onCheckedChange={() => handleModuleChange('ventas', 'reposteria')}
                    />
                    <Label htmlFor="ventas-reposteria">Repostería</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ventas-manualidades"
                      name="ventas-manualidades"
                      checked={modules.ventas.manualidades}
                      onCheckedChange={() => handleModuleChange('ventas', 'manualidades')}
                    />
                    <Label htmlFor="ventas-manualidades">Manualidades</Label>
                  </div>
                </div>
              </div>
              {/* Módulo Alquileres */}
              <div className="space-y-2">
                <h3 className="font-medium">Alquileres</h3>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="alquileres-santaCatalina"
                      name="alquileres-santaCatalina"
                      checked={modules.alquileres.santaCatalina}
                      onCheckedChange={() => handleModuleChange('alquileres', 'santaCatalina')}
                    />
                    <Label htmlFor="alquileres-santaCatalina">Santa Catalina</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="alquileres-goyoneche"
                      name="alquileres-goyoneche"
                      checked={modules.alquileres.goyoneche}
                      onCheckedChange={() => handleModuleChange('alquileres', 'goyoneche')}
                    />
                    <Label htmlFor="alquileres-goyoneche">Goyoneche</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="alquileres-santaMarta"
                      name="alquileres-santaMarta"
                      checked={modules.alquileres.santaMarta}
                      onCheckedChange={() => handleModuleChange('alquileres', 'santaMarta')}
                    />
                    <Label htmlFor="alquileres-santaMarta">Santa Marta</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;