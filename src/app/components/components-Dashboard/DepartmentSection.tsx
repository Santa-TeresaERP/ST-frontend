"use client";

import { useRouter } from 'next/navigation';
import Image from "next/image";
import { ArrowRight } from 'lucide-react';

type DepartmentItem = {
  name: string;
  icon: string;
};

type DepartmentSectionProps = {
  title: string;
  items: DepartmentItem[];
  columns?: 1 | 2 | 3;
};

const DepartmentSection = ({ title, items, columns = 3 }: DepartmentSectionProps) => {
  const router = useRouter();

  const handleItemClick = (name: string) => {
    switch (name) {
      case "Usuarios": router.push('/pages/dashboard/users'); break;
      case "Modules": router.push('/pages/dashboard/modules'); break;
      case "Roles": router.push('/pages/dashboard/roles'); break;
      case "Ventas": router.push('/pages/dashboard/ventas'); break;
      case "Produccion": router.push('/pages/dashboard/produccion'); break;
      case "Inventario": router.push('/pages/dashboard/inventario'); break;
      case "Santa Catalina": router.push('/pages/dashboard/santa-catalina'); break;
      case "Goyeneche": router.push('/pages/dashboard/goyoneche'); break;
      case "Santa Marta": router.push('/pages/dashboard/santa-marta'); break;
      case "Museo": router.push('/pages/dashboard/museo'); break;
      case "Alquileres": router.push('/pages/dashboard/alquileres'); break;
      case "Finanzas": router.push('/pages/dashboard/finanzas'); break;
      case "Monasterio": router.push('/pages/dashboard/monasterio'); break;
      case "Iglesia": router.push('/pages/dashboard/iglesia'); break;
      default: console.warn(`No route defined for ${name}`);
    }
  };

  const getGridClass = () => {
    if (columns === 1) return 'grid-cols-1';
    if (columns === 2) return 'grid-cols-1 md:grid-cols-2';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  };

  return (
    <section className="w-full">
      {/* Título del departamento */}
      <div className="mb-10 text-center">
        <h3 className="text-2xl md:text-3xl font-extrabold text-white inline-block relative pb-4">
          {title}
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-red-700 rounded-full"></span>
        </h3>
      </div>

      {/* Grid de tarjetas */}
      <div className={`grid ${getGridClass()} gap-8 justify-items-center`}>
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => handleItemClick(item.name)}
            className="
              w-full max-w-sm
              relative overflow-hidden
              group cursor-pointer
              flex flex-col items-center justify-center
              p-10
              bg-white/95 backdrop-blur-sm
              rounded-3xl
              shadow-xl
              border-2 border-red-800/80
              transition-all
              duration-300
              hover:shadow-2xl
              hover:border-red-600
              hover:-translate-y-2
              hover:bg-white
              hover:scale-105
              min-h-[240px]
            "
          >
            {/* Círculo decorativo */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-red-800/10 rounded-full transition-all duration-500 group-hover:scale-150 group-hover:bg-red-800/20"></div>

            {/* Icono */}
            <div className="relative z-10 mb-6 p-6 bg-red-50 rounded-full group-hover:bg-red-100 transition-all duration-300 group-hover:scale-110 shadow-md">
              <Image
                src={`/${item.icon}`}
                alt={item.name}
                width={64}
                height={64}
                className="object-contain"
              />
            </div>

            {/* Nombre del módulo */}
            <h4 className="relative z-10 text-2xl font-bold text-gray-900 text-center mb-4 group-hover:text-red-800 transition-colors">
              {item.name}
            </h4>

            {/* Botón "Acceder" */}
            <div className="relative z-10 flex items-center text-red-700 font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-3 group-hover:translate-y-0">
              <span className="text-sm tracking-wide">Acceder</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </div>

            {/* Borde inferior decorativo */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-800 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DepartmentSection;