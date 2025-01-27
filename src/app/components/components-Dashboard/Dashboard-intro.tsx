'use client';

import React from 'react';
import DepartmentSection from "../../components/components-Dashboard/DepartmentSection";
import { useAuthStore } from '@/core/store/auth';

const Dashboard = () => {

  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <main className="p-8 bg-gray-100">
        <h2 className="text-xl font-semibold mb-6 text-center">
          ¡BIENVENIDO {user?.name|| 'USUARIO'}!
        </h2>
        <DepartmentSection title="Departamento Administrativo" items={[
          { name: "Modules", icon: "cuboid.svg" },
          { name: "Usuarios", icon: "users.svg" },
          { name: "Roles", icon: "user-cog.svg" }
        ]} />

        <DepartmentSection title="Departamento de Ventas" items={[
          { name: "Repostería", icon: "cake-slice.svg" },
          { name: "Manualidades", icon: "lightbulb.svg" },
          { name: "Misa", icon: "church.svg" },
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
