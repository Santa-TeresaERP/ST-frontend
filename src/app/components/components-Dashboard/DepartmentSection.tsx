"use client";

import { useRouter } from 'next/navigation'; 
import Image from "next/image";

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
      case "Repostería":
        router.push('/pages/dashboard/reposteria');
        break;
      case "Manualidades":
        router.push('/pages/dashboard/manualidades');
        break;
      case "Misa":
        router.push('/pages/dashboard/misa');
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
    <section className="my-8">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        {items.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center w-48 h-32 p-4 bg-white rounded-lg shadow-md cursor-pointer ${
              index === 0 && items.length === 1 ? "col-span-full" : ""
            }`}
            onClick={() => handleItemClick(item.name)}
          >
            <Image src={`/${item.icon}`} alt={item.name} width={40} height={40} />
            <p className="mt-2 font-medium text-red-600">{item.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DepartmentSection;
