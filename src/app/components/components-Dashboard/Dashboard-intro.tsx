'use client';

import React from 'react';
import DepartmentSection from "../../components/components-Dashboard/DepartmentSection";
import { useAuthStore } from '@/core/store/auth';

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const userWithPermissions = useAuthStore((state) => state.userWithPermissions);

  const getUserName = () => {
    if (typeof user === 'string') return user;
    if (user && typeof user === 'object' && user.name) return user.name;
    if (userWithPermissions && typeof userWithPermissions === 'object' && userWithPermissions.name) {
      return userWithPermissions.name;
    }
    if (typeof userWithPermissions === 'string') return userWithPermissions;
    return 'Usuario';
  };

  const displayName = getUserName();

  return (
    <div className="min-h-screen">
      <div
        className="fixed inset-0 -z-10 bg-[url('https://www.peru.travel/Contenido/Uploads/claustro-principal-convento-santa-rosa_637781260094823018.jpg')] bg-cover bg-center bg-no-repeat"
      ></div>

      <div className="fixed inset-0 -z-5 bg-black/60"></div>

      <main className="py-8 px-4 relative">
        {/* Header */}
        <div className="relative mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            ¡Bienvenido <span className="text-red-300">{displayName}</span>!
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-700 to-transparent opacity-80 mx-auto mb-6"></div>

          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Selecciona un módulo para comenzar a gestionar el sistema
          </p>
        </div>

        {/* Contenedor principal centrado */}
        <div className="max-w-[1400px] mx-auto space-y-16">
          
          {/* Departamento Administrativo - 3 columnas */}
          <DepartmentSection 
            title="Departamento Administrativo" 
            columns={3}
            items={[
              { name: "Modules", icon: "cuboid.svg" },
              { name: "Usuarios", icon: "users.svg" },
              { name: "Roles", icon: "user-cog.svg" },
            ]} 
          />

          {/* Departamento de Ventas - 3 columnas */}
          <DepartmentSection 
            title="Departamento de Ventas"
            columns={3}
            items={[
              { name: "Ventas", icon: "cake-slice.svg" },
              { name: "Produccion", icon: "ajuste.png" },
              { name: "Inventario", icon: "inventary.png" },
            ]} 
          />

          {/* Departamentos individuales - 3 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <DepartmentSection 
              title="Departamento de Museo"
              columns={1}
              items={[
                { name: "Museo", icon: "museo.png" },
              ]} 
            />
            
            <DepartmentSection 
              title="Departamento de Alquileres"
              columns={1}
              items={[
                { name: "Alquileres", icon: "alquilar.png" },
              ]} 
            />
            
            <DepartmentSection 
              title="Departamento de Finanzas"
              columns={1}
              items={[
                { name: "Finanzas", icon: "finanzas.png" },
              ]} 
            />
          </div>

          {/* Monasterio e Iglesia - 2 columnas centradas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <DepartmentSection 
              title="Monasterio"
              columns={1}
              items={[
                { name: "Monasterio", icon: "monastery.png" },
              ]} 
            />
            
            <DepartmentSection 
              title="Iglesia"
              columns={1}
              items={[
                { name: "Iglesia", icon: "monastery.png" },
              ]} 
            />
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;