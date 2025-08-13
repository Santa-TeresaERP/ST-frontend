// MonasteryComponentView.tsx
import Image from 'next/image'
import { PlusCircle, Filter } from 'lucide-react'

const MonasteryComponentView: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center text-red-700">Gastos Monasterio</h1>
      </div>
      <div className="flex justify-center mt-4 mb-6 md:mt-6 md:mb-8">
              <Image
  src="/santa teresa.jpg"
  alt="Santa Teresa"
  width={1900}
  height={500}
  className="rounded-xl shadow-md object-cover object-[center_60%] h-48 md:h-64 w-full"
/>
            </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-3xl font-semibold text-red-700 mb-2 sm:mb-0">Lista de Gastos</h2>
        <div className="flex flex-col sm:flex-row justify-end gap-2 w-full sm:w-auto">
          <button
            className="flex items-center justify-center bg-red-700 text-white px-4 py-2 rounded-3xl whitespace-nowrap"
          >
            <PlusCircle className="mr-2" /> Registrar Gastos
          </button>
        </div>
      </div>
      {/* Filtro de Fecha */}
      <div className="flex items-center mb-4 gap-2">
        <label className="text-gray-700 font-semibold flex items-center gap-1">
          <Filter size={16} /> Mostrar:
        </label>
        <select
          className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="last3days">Últimos 3 días</option>
          <option value="last7days">Últimos 7 días</option>
          <option value="last30days">Últimos 30 días</option>
          <option value="all">Todos</option>
        </select>
      </div>
      
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-gray-700">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Descripcion</th>
              <th className="px-4 py-2">Monto</th>
              <th className="px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonasteryComponentView;