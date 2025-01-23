"use client";

import React from "react";
import { useFetchRoles } from "@/modules/roles/hook/useRoles";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { UserIcon } from 'lucide-react'; // Import the user icon

const RoleList: React.FC = () => {
  const { data: roles, isLoading, error } = useFetchRoles();

  if (isLoading) {
    console.log('Loading roles...');
    return <div>Loading...</div>;
  }

  if (error) {
    console.error('Error fetching roles:', error);
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold mb-6 text-center">Listado de Roles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles && roles.map((role) => (
          <Card key={role.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-red-600 h-1/2 flex items-center justify-center">
              <CardTitle className="text-pink-200 text-2xl text-center flex items-center justify-between w-full px-4">
                {role.name}
                <UserIcon className="h-6 w-6 text-pink-200" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col items-center justify-center text-center">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xl">Descripción del Rol</Label>
                  <p className="text-lg">{role.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoleList;