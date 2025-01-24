"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../app/components/ui/dialog";
import { Button } from "../../../app/components/ui/button";
import { Input } from "../../../app/components/ui/input";
import { Label } from "../../../app/components/ui/label";
import { ChangePasswordRequest } from '@/modules/user-creations/types/user';

interface ChangePasswordFormProps {
  isOpen: boolean;
  onClose: () => void;
  user: { id: string };
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ isOpen, onClose, user }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ChangePasswordRequest = {
      userId: user.id,
      currentPassword,
      newPassword,
    };

    // Aquí deberías agregar la lógica para cambiar la contraseña, por ejemplo, llamar a una API
    try {
      console.log('Changing password with payload:', payload);
      // await changePassword(payload);
      onClose();
    } catch (error) {
      console.error('Error changing password:', error);
      setErrors({ submit: 'Error changing password' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Cambiar Contraseña</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleChangePassword} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Contraseña Actual</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            {errors.currentPassword && <p className="text-red-600">{errors.currentPassword}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nueva Contraseña</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            {errors.newPassword && <p className="text-red-600">{errors.newPassword}</p>}
          </div>
          {errors.submit && <p className="text-red-600">{errors.submit}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              Cambiar Contraseña
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordForm;