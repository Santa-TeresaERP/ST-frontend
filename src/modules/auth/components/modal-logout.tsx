"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../app/components/ui/dialog";
import { Button } from "../../../app/components/ui/button";

type LogoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
};

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onLogout }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>¿Quieres cerrar sesión?</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-center">¿Estás seguro de que quieres cerrar sesión?</p>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            No
          </Button>
          <Button type="button" className="bg-red-600 hover:bg-red-700" onClick={onLogout}>
            Sí
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutModal;
