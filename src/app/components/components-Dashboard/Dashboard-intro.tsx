'use client';

import React from 'react';
import DepartmentSection from "../../components/components-Dashboard/DepartmentSection";

const Dashboard = () => {

  return (
    <div>
      <main className="p-8 bg-gray-100">
        <h2 className="text-xl font-semibold mb-6 text-center">
          ¡BIENVENIDO USUARIO!
        </h2>
        <DepartmentSection title="Departamento Administrativo" items={[
          { name: "Modules", icon: "usuarioicon1.png" },
          { name: "Usuarios", icon: "usuarioicon1.png" },
          { name: "Roles", icon: "usuarioicon1.png" }
        ]} />

        <DepartmentSection title="Departamento de Ventas" items={[
          { name: "Repostería", icon: "pasteleria.png" },
          { name: "Manualidades", icon: "manualidades.png" },
          { name: "Misa", icon: "misa.png" },
        ]} />

        <DepartmentSection title="Departamento de Alquileres" items={[
          { name: "Santa Catalina", icon: "misa.png" },
          { name: "Goyeneche", icon: "misa.png" },
          { name: "Santa Marta", icon: "misa.png" },
        ]} />
      </main>
    </div>
  );
};

export default Dashboard;
