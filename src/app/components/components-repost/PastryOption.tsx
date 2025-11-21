"use client";

import { useState } from "react";
import { ChevronLeft, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Incomes from "./Incomes";
import Expenses from "./Expenses";
import ProductList from "./ProductList";

export default function OpcionesReposteria() {
  // Estado para la sección activa
  const [activeSection, setActiveSection] = useState<'incomes' | 'expenses' | 'products' | null>(null);

  // Función para obtener el título dinámico del encabezado
  const getHeaderTitle = () => {
    switch (activeSection) {
      case "incomes":
        return "Repostería - Ingresos";
      case "expenses":
        return "Repostería - Egresos";
      case "products":
        return "Repostería - Productos";
      default:
        return "Ventas - Repostería";
    }
  };

  const handleIngresosClick = () => setActiveSection("incomes");
  const handleEgresosClick = () => setActiveSection("expenses");
  const handleProductosClick = () => setActiveSection("products");
  const handleBackToMenu = () => setActiveSection(null);

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-red-600 text-white px-4 py-3 flex justify-between items-center">
        {activeSection ? (
          <button onClick={handleBackToMenu} className="text-white hover:text-white/90">
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : (
          <Link href="#" className="text-white hover:text-white/90">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        )}
        <h1 className="text-lg font-semibold">{getHeaderTitle()}</h1>
        <Link href="/dashboard" className="text-white hover:text-white/90">
          <Home className="h-5 w-5" />
        </Link>
      </header>
      <main className="text-center py-8">
        {!activeSection && (
          <>
            <h2 className="text-2xl font-bold mb-6">Opciones</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
              {[{ name: "Ingresos", icon: "/ingresos.png", onClick: handleIngresosClick },
                { name: "Egresos", icon: "/egresos.png", onClick: handleEgresosClick },
                { name: "Productos", icon: "/manualidades.png", onClick: handleProductosClick },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white w-full max-w-[250px] mx-auto p-20 rounded-lg shadow-lg flex flex-col items-center justify-center hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={item.onClick}
                >
                  <div className="flex justify-center items-center rounded-full mb-6">
                    <Image src={item.icon} alt={item.name} width={70} height={70} />
                  </div>
                  <h3 className="text-xl font-semibold text-red-600">{item.name}</h3>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Contenido de las secciones activas */}
        {activeSection === "incomes" && (
          <div className="w-full">
            <Incomes />
          </div>
        )}
        {activeSection === "expenses" && (
          <div className="w-full">
            <Expenses />
          </div>
        )}
        {activeSection === "products" && (
          <div className="w-full">
            <ProductList />
          </div>
        )}
      </main>
    </div>
  );
}
