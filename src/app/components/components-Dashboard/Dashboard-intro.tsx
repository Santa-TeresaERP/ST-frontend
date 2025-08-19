'use client';

import React from 'react';
import DepartmentSection from "../../components/components-Dashboard/DepartmentSection";
import { useAuthStore } from '@/core/store/auth';


const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const userWithPermissions = useAuthStore((state) => state.userWithPermissions);

  // 🔥 OBTENER NOMBRE DE USUARIO DE MANERA FLEXIBLE
  const getUserName = () => {
    // Si user es un string, usarlo directamente
    if (typeof user === 'string') {
      return user;
    }
    // Si user es un objeto con name
    if (user && typeof user === 'object' && user.name) {
      return user.name;
    }
    // Si userWithPermissions tiene name
    if (userWithPermissions && typeof userWithPermissions === 'object' && userWithPermissions.name) {
      return userWithPermissions.name;
    }
    // Si userWithPermissions es un string
    if (typeof userWithPermissions === 'string') {
      return userWithPermissions;
    }
    return 'Usuario';
  };

  const displayName = getUserName();

  return (
    <div className="min-h-screen">
      <div
        className="fixed inset-0 -z-10 bg-[url('https://www.peru.travel/Contenido/Uploads/claustro-principal-convento-santa-rosa_637781260094823018.jpg')] bg-cover bg-center bg-no-repeat"
      ></div>

      <div className="fixed inset-0 -z-5 bg-black/60"></div>

      <main className="p-8 relative">
        <div className="relative mb-12 text-center">
          <h2 className="text-2xl md:text-5xl font-extrabold text-white bg-clip-text bg-gradient-to-r from-red-700 to-red-800 mb-4 animate-fade-in">
            ¡Bienvenido <span className="text-white">{displayName}</span>!
          </h2>

          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-red-700 to-transparent opacity-80"></div>

          <p className="mt-6 p-2 text-lg text-white/80 max-w-2xl mx-auto">
            Selecciona un módulo para comenzar a gestionar el sistema
          </p>
        </div>

        <DepartmentSection title="Departamento Administrativo" items={[
          { name: "Modules", icon: "cuboid.svg" },
          { name: "Usuarios", icon: "users.svg" },
          { name: "Roles", icon: "user-cog.svg" },
        ]} />

        <DepartmentSection title="Departamento de Ventas" items={[
          { name: "Ventas", icon: "cake-slice.svg" },
          { name: "Produccion", icon: "ajuste.png" },
          { name: "Inventario", icon: "inventary.png" },
        ]} />

        <div className="flex flex-col md:flex-row justify-center items-start gap-8">
          <div className="flex-1 flex justify-center">
            <DepartmentSection title="Departamento de Museo" items={[
              { name: "Museo", icon: "museo.png" },
            ]} />
          </div>
          <div className="flex-1 flex justify-center">
            <DepartmentSection title="Departamento de Alquileres" items={[
              { name: "Alquileres", icon: "alquilar.png" },
            ]} />
          </div>
          <div className="flex-1 flex justify-center">
            <DepartmentSection title="Departamento de Finanzas" items={[
              { name: "Finanzas", icon: "finanzas.png" },
            ]} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-start gap-8">
          <div className="flex-1 flex justify-center">
            <DepartmentSection title="Monasterio" items={[
              { name: "Monasterio", icon: "monastery.png" },
            ]} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;