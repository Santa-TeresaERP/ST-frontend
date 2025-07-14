"use client";

import React, { useEffect, useState } from "react";
import { useFetchUser } from "@/modules/user-creations/hook/useUsers";
import { useFetchRoles } from "@/modules/roles/hook/useRoles";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import ChangePasswordForm from './modal-change-password';
import { UserCircle, Lock, XCircle } from "lucide-react";

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
    <div className="flex justify-center px-4 py-10 bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
      <div className="w-full max-w-4xl">
        <Card className="rounded-3xl shadow-2xl overflow-hidden border border-gray-300">
          {/* Header con degradado rojo */}
          <CardHeader className="bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white py-8 px-6">
            <div className="flex items-center gap-4">
              <UserCircle className="w-14 h-14 text-white" />
              <div>
                <h2 className="text-2xl font-bold">Perfil de Usuario</h2>
                <p className="text-sm text-red-100 italic">{user?.email}</p>
              </div>
            </div>
          </CardHeader>
          
          {/* Contenido */}
          <CardContent className="bg-white p-6 sm:p-8 space-y-10">
            {/* Información Personal */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-1 mb-6">
                Información Personal
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm text-gray-600">Nombre</Label>
                  <Input
                    value={user?.name || ""}
                    readOnly
                    className="bg-gray-50 border border-gray-300 focus:ring-red-300"
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-600">DNI</Label>
                  <Input
                    value={user?.dni || ""}
                    readOnly
                    className="bg-gray-50 border border-gray-300 focus:ring-red-300"
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Correo</Label>
                  <Input
                    value={user?.email || ""}
                    readOnly
                    className="bg-gray-50 border border-gray-300 focus:ring-red-300"
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Teléfono</Label>
                  <Input
                    value={user?.phonenumber || ""}
                    readOnly
                    className="bg-gray-50 border border-gray-300 focus:ring-red-300"
                  />
                </div>
              </div>
            </section>

            {/* Rol */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-1 mb-6">
                Rol de Usuario
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm text-gray-600">Rol</Label>
                  <Input
                    value={userRole?.name || ""}
                    readOnly
                    className="bg-gray-50 border border-gray-300 focus:ring-red-300"
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Descripción del Rol</Label>
                  <Input
                    value={userRole?.description || ""}
                    readOnly
                    className="bg-gray-50 border border-gray-300 focus:ring-red-300"
                  />
                </div>
              </div>
            </section>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                onClick={handleOpenChangePasswordModal}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-4 py-2 w-full sm:w-auto"
              >
                <Lock className="w-4 h-4" />
                Cambiar Contraseña
              </Button>
              <Button
                onClick={onClose}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-400 flex items-center gap-2 px-4 py-2 w-full sm:w-auto"
              >
                <XCircle className="w-4 h-4" />
                Cerrar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modal contraseña */}
        {user && (
          <ChangePasswordForm
            isOpen={isChangePasswordModalOpen}
            onClose={handleCloseChangePasswordModal}
            user={user}
          />
        )}
      </div>
    </div>

  );
  
};

export default UserDetail;