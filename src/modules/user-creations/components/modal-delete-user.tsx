"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../app/components/ui/dialog"; 
import { Button } from "../../../app/components/ui/button";
import { User } from '@/app/lib/interfaces';

type DeleteUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onDelete: (userId: number) => void;
};

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ isOpen, onClose, user, onDelete }) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar Usuario</DialogTitle>
        </DialogHeader>
        <div className="text-center py-8">
          <p className="text-gray-600">¿Estás seguro de que quieres eliminar este usuario?</p>
          <div className="mt-4 flex justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="button" className="bg-red-600 hover:bg-red-700 ml-2" onClick={() => onDelete(user.id)}>
              Eliminar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserModal;
