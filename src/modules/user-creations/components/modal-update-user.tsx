"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../app/components/ui/dialog";
import { Button } from "../../../app/components/ui/button";
import { Input } from "../../../app/components/ui/input";
import { Label } from "../../../app/components/ui/label";
import { User } from '@/app/lib/interfaces';

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUpdate: (userId: number, userData: Partial<User>) => void;
};

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState<Partial<User>>({});

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.id) {
      onUpdate(user.id, formData);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? "Editar Usuario" : "Eliminar Usuario"}</DialogTitle>
        </DialogHeader>
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" type="text" value={formData.name || ""} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" name="email" type="email" value={formData.email || ""} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phonenumber">Número de Teléfono</Label>
              <Input id="phonenumber" name="phonenumber" type="text" value={formData.phonenumber || ""} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dni">DNI</Label>
              <Input id="dni" name="dni" type="text" value={formData.dni || ""} onChange={handleInputChange} />
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
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">¿Estás seguro de que quieres editar este usuario?</p>
            <div className="mt-4 flex justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="button" className="bg-red-600 hover:bg-red-700 ml-2" onClick={handleSubmit}>
                Eliminar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;