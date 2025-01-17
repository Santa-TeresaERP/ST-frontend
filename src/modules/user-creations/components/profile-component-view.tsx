"use client";

import React, { useEffect } from "react";
import { useFetchUser } from "@/modules/user-creations/hook/useUsers";
import { useFetchRoles } from "@/modules/user-creations/hook/useRoles";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

const UserDetail = ({ userId, onClose }: { userId: string; onClose: () => void }) => {
  const { data: user, isLoading: isLoadingUser, error: errorUser } = useFetchUser(userId);
  const { data: roles, isLoading: isLoadingRoles, error: errorRoles } = useFetchRoles();

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
          <div className="flex justify-end mt-4">
            <Button onClick={onClose}>Cerrar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetail;