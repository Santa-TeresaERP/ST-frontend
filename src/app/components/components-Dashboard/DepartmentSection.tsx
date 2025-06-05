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
};

const DepartmentSection = ({ title, items }: DepartmentSectionProps) => {
  const router = useRouter(); 

  const handleItemClick = (name: string) => {
    switch (name) {
      case "Usuarios":
        router.push('/pages/dashboard/users');
        break;
      case "Modules":
        router.push('/pages/dashboard/modules');
        break;
      case "Roles":
        router.push('/pages/dashboard/roles');
        break;  
      case "Ventas":
        router.push('/pages/dashboard/ventas');
        break;
      case "Produccion":
        router.push('/pages/dashboard/produccion');
        break;
      case "Inventario":
        router.push('/pages/dashboard/inventario');
        break;
      case "Santa Catalina":
        router.push('/pages/dashboard/santa-catalina');
        break;
      case "Goyeneche":
        router.push('/pages/dashboard/goyoneche');
        break;
      case "Santa Marta":
        router.push('/pages/dashboard/santa-marta');
        break;
      default:
        console.warn(`No route defined for ${name}`);
    }
  };

  return (
    <section className="my-12 max-w-7xl mx-auto px-4 ">
      <div className="mb-12 text-center ">
        <h3 className="text-2xl font-extrabold text-white inline-block relative p-4">
          {title}
          <span className="absolute -bottom-2 left-0 right-0 mx-auto w-16 h-2 bg-red-800 rounded-full"></span>
        </h3>
      </div>
  
      <div className="w-full flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-20 gap-y-8">
          {items.map((item, index) => (
            <div
              key={index}
              className={`
                w-64 h-48 
                relative overflow-hidden
                group
                flex flex-col items-center justify-between
                p-8
                bg-white
                rounded-2xl
                shadow-lg
                border-2 border-red-800
                transition-all
                duration-300
                hover:shadow-xl
                hover:border-red-200
                hover:-translate-y-2
              `}
              onClick={() => handleItemClick(item.name)}
            >
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-red-800 rounded-full transition-all duration-500 group-hover:scale-150"></div>
  
              <div className="relative z-10 mb-6 p-4 bg-red-300/30 rounded-full group-hover:bg-red-300/80 transition-colors">
                <Image 
                  src={`/${item.icon}`}
                  alt={item.name}
                  width={48}
                  height={48}
                  className="text-red-500"
                />
              </div>
  
              <h4 className="relative z-10 text-2xl font-bold text-[#393939] text-center mb-2">
                {item.name}
              </h4>
  
              <div className="relative z-10 mt-4 flex items-center text-red-800 font-medium">
                <span>Acceder</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DepartmentSection;
