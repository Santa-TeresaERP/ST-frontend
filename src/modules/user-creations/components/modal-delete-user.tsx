"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../app/components/ui/dialog";
import { Button } from "../../../app/components/ui/button";
import { User } from '@/modules/user-creations/types/user';
import { Trash2 } from "lucide-react"

type DeleteUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onDelete: (userId: string) => void;
};

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ isOpen, onClose, user, onDelete }) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[460px] rounded-3xl shadow-2xl px-6 py-8 bg-white">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Icono */}
          <div className="bg-red-100 rounded-full p-4 mb-4">
            <Trash2 className="w-10 h-10 text-red-600" />
          </div>
  
          {/* Título */}
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-gray-800">¿Eliminar Usuario?</DialogTitle>
          </DialogHeader>
  
          {/* Texto de advertencia */}
          <p className="text-gray-600 mt-2 text-base">
            Esta acción <span className="font-semibold text-red-600">no se puede deshacer</span>. ¿Estás seguro de que quieres eliminar este usuario?
          </p>
  
          {/* Botones */}
          <div className="mt-8 w-full flex justify-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => onDelete(user.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Eliminar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserModal;