"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../app/components/ui/dialog";
import { Button } from "../../../app/components/ui/button";
import { Input } from "../../../app/components/ui/input";
import { Label } from "../../../app/components/ui/label";
import { ChangePasswordRequest } from '@/modules/user-creations/types/user';
import { useChangePassword } from '@/modules/user-creations/hook/useUsers';
import { Eye, EyeOff } from 'lucide-react';

interface ChangePasswordFormProps {
  isOpen: boolean;
  onClose: () => void;
  user: { id: string };
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ isOpen, onClose, user }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { mutate: changePasswordMutation, isPending } = useChangePassword();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const payload: ChangePasswordRequest = {
      userId: user.id,
      currentPassword,
      newPassword,
    };

    changePasswordMutation(payload, {
      onSuccess: () => {
        console.log('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        onClose();
      },
      onError: (error: unknown) => {
        // Si es error de permisos silencioso, no hacer nada
        const errorObj = error as { isPermissionError?: boolean; silent?: boolean };
        if (errorObj?.isPermissionError && errorObj?.silent) {
          // Error silencioso, no hacer nada aquí
          return;
        }
        
        // Extraer el mensaje específico del error del backend
        const axiosError = error as { response?: { data?: { error?: string; message?: string } } };
        let errorMessage = 'Error al cambiar la contraseña';
        
        if (axiosError?.response?.data?.error) {
          errorMessage = axiosError.response.data.error;
        } else if (axiosError?.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
        
        console.error('Error changing password:', error);
        setErrors({ submit: errorMessage });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95%] sm:max-w-[500px] p-0 rounded-2xl overflow-hidden shadow-lg">
        
        {/* Header accesible con estilo completo */}
        <DialogHeader>
          <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white px-6 py-5">
            <DialogTitle className="text-xl sm:text-2xl font-bold">Cambiar Contraseña</DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleChangePassword} className="space-y-6 px-6 py-6 bg-white">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-gray-800">Contraseña Actual</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                name="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-300 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showCurrentPassword ? 'Ocultar contraseña actual' : 'Mostrar contraseña actual'}
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-600 text-sm">{errors.currentPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-gray-800">Nueva Contraseña</Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-300 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showNewPassword ? 'Ocultar nueva contraseña' : 'Mostrar nueva contraseña'}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-600 text-sm">{errors.newPassword}</p>
            )}
          </div>

          {errors.submit && (
            <p className="text-red-600 text-sm">{errors.submit}</p>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
            >
              {isPending ? 'Cambiando...' : 'Cambiar Contraseña'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordForm;