'use client';

import React from 'react';
import DepartmentSection from "../../components/components-Dashboard/DepartmentSection";
import { useAuthStore } from '@/core/store/auth';


const Dashboard = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen">
      <div 
        className="fixed inset-0 -z-10 bg-[url('https://www.peru.travel/Contenido/Uploads/claustro-principal-convento-santa-rosa_637781260094823018.jpg')] bg-cover bg-center bg-no-repeat"
      ></div>
      
      <div className="fixed inset-0 -z-5 bg-black/60"></div> 
      
      <main className="p-8 relative">
        <div className="relative mb-12 text-center">
          <h2 className="text-2xl md:text-5xl font-extrabold text-white bg-clip-text bg-gradient-to-r from-red-700 to-red-800 mb-4 animate-fade-in">
            ¡Bienvenido <span className="text-white">{user?.name || 'Usuario'}</span>!
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
          { name: "Produccion", icon: "lightbulb.svg" },
          { name: "Inventario", icon: "church.svg" },
        ]} />

        <DepartmentSection title="Departamento de Alquileres" items={[
          { name: "Santa Catalina", icon: "church.svg" },
          { name: "Goyeneche", icon: "church.svg" },
          { name: "Santa Marta", icon: "church.svg" },
        ]} />
      </main>
    </div>
  );
};

export default Dashboard;