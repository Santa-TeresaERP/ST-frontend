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
      <DialogContent className="w-full max-w-xs sm:max-w-sm rounded-3xl shadow-2xl px-6 py-8 bg-white mx-2">
        <DialogHeader>
          <DialogTitle>¿Quieres cerrar sesión?</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-center">¿Estás seguro de que quieres cerrar sesión?</p>
        </div>
        <DialogFooter className="mt-8 w-full flex flex-row justify-center gap-4">
          <Button type="button" variant="outline" onClick={onClose} className="w-full rounded-3xl">
            No
          </Button>
          <Button type="button" className="bg-red-600 hover:bg-red-700 w-full rounded-3xl text-white" onClick={onLogout}>
            Sí
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutModal;
