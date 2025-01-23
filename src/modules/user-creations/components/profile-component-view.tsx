"use client";

import React, { useEffect, useState } from "react";
import { useFetchUser } from "@/modules/user-creations/hook/useUsers";
import { useFetchRoles } from "@/modules/roles/hook/useRoles";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import ChangePasswordForm from './modal-change-password';

const UserDetail = ({ userId, onClose }: { userId: string; onClose: () => void }) => {
  const { data: user, isLoading: isLoadingUser, error: errorUser } = useFetchUser(userId);
  const { data: roles, isLoading: isLoadingRoles, error: errorRoles } = useFetchRoles();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  useEffect(() => {
    console.log('Fetching user details for ID:', userId);
  }, [userId]);

  useEffect(() => {
    if (user) {
      console.log('User details fetched:', user);
    }
  }, [user]);

  useEffect(() => {
    if (roles) {
      console.log('Roles fetched:', roles);
    }
  }, [roles]);

  if (isLoadingUser || isLoadingRoles) {
    console.log('Loading user details or roles...');
    return <div>cargando...</div>;
  }

  if (errorUser || errorRoles) {
    console.error('Error loading user details or roles:', errorUser || errorRoles);
    return <div>Error loading user details or roles</div>;
  }

  const userRole = roles?.find(role => role.id === user?.roleId);

  const handleOpenChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true);
  };

  const handleCloseChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="bg-red-50">
          <CardTitle className="flex items-center text-red-600">
            Perfil de usuario
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input value={user?.name || ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label>DNI</Label>
              <Input value={user?.dni || ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input value={user?.phonenumber || ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Rol</Label>
              <Input value={userRole?.name || ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Descripción del Rol</Label>
              <Input value={userRole?.description || ""} readOnly />
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <Button onClick={handleOpenChangePasswordModal} className="bg-yellow-600 hover:bg-yellow-700 text-white">
              Cambiar Contraseña
            </Button>
            <Button onClick={onClose}>Cerrar</Button>
          </div>
        </CardContent>
      </Card>
      {user && (
        <ChangePasswordForm
          isOpen={isChangePasswordModalOpen}
          onClose={handleCloseChangePasswordModal}
          user={user}
        />
      )}
    </div>
  );
};

export default UserDetail;