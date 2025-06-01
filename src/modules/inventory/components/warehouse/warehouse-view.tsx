import React, { useState } from 'react';
import { Filter, Home, PlusCircle, Package, Users, Edit, Trash } from 'lucide-react';

type Movement = {
  id: number;
  tipo: 'producto' | 'recurso';
  nombre: string;
  almacen: string;
  cantidad: number;
  fechaEntrada: string;
};

const initialMovimientos: Movement[] = [
  { id: 1, tipo: 'producto', nombre: 'Harina de Trigo', almacen: 'Cerro Colorado', cantidad: 150, fechaEntrada: '2025-05-15' },
  { id: 2, tipo: 'recurso', nombre: 'Mano de Obra', almacen: 'Santa Catalina', cantidad: 8, fechaEntrada: '2025-05-17' },
  { id: 3, tipo: 'producto', nombre: 'Azúcar', almacen: 'San Juan', cantidad: 300, fechaEntrada: '2025-05-18' },
];

const WarehouseView: React.FC = () => {
  const [movimientos, setMovimientos] = useState<Movement[]>(initialMovimientos);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Movement | null>(null);
  const [selectedType, setSelectedType] = useState<'producto' | 'recurso'>('producto');

  // Filtrar movimientos por nombre, almacen o tipo
  const filteredMovimientos = movimientos.filter(
    (m) =>
      (selectedType === 'producto' ? m.tipo === 'producto' : m.tipo === 'recurso') &&
      (m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.almacen.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-blue-700">
          Movimientos de Almacén
        </h2>
        <div className="flex gap-2">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${
              selectedType === 'producto'
                ? 'bg-blue-700 text-white'
                : 'bg-white text-blue-700 border border-blue-700'
            }`}
            onClick={() => setSelectedType('producto')}
          >
            <Package size={18} /> Producto
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${
              selectedType === 'recurso'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-orange-500 border border-orange-500'
            }`}
            onClick={() => setSelectedType('recurso')}
          >
            <Users size={18} /> Recurso
          </button>
        </div>
      </div>

      {/* Subheader */}
      <div className="flex items-center space-x-2 text-gray-600">
        <Home size={24} className="text-blue-700" />
        <span className="text-lg font-medium">Gestión de movimientos del almacén</span>
      </div>

      {/* Acciones y Filtro */}
      <div className="flex justify-end items-center space-x-6">
        <div className="flex items-center space-x-3 select-none">
          <button
            onClick={() => setShowCreate(true)}
            className={`px-4 py-2 rounded-full font-semibold transition-colors duration-300 flex items-center gap-2 ${
              selectedType === 'producto'
                ? 'bg-blue-700 text-white hover:bg-blue-800'
                : 'bg-gray-300 text-gray-700 cursor-not-allowed'
            }`}
            disabled={selectedType !== 'producto'}
          >
            <PlusCircle size={18} /> Crear {selectedType === 'producto' ? 'Producto' : 'Recurso'}
          </button>
        </div>
        <div className="relative inline-flex items-center shadow-sm rounded-xl bg-white">
          <Filter className="absolute left-4 text-blue-700 pointer-events-none" size={20} />
          <input
            type="text"
            className="pl-11 pr-6 py-3 rounded-xl border border-blue-700 text-gray-700 text-base
                       focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent
                       hover:bg-gray-200 transition duration-300 min-w-[200px]"
            placeholder={`Buscar por ${selectedType === 'producto' ? 'producto o almacén' : 'recurso o almacén'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de movimientos */}
      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        {/* Aquí podrías poner el modal de creación/edición si lo tienes */}
        {/* {showCreate && ...}
            {editing && ...}
        */}
        {filteredMovimientos.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            {searchTerm
              ? 'No se encontraron movimientos que coincidan con la búsqueda'
              : `No hay movimientos de ${selectedType === 'producto' ? 'productos' : 'recursos'} registrados.`}
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className={selectedType === 'producto' ? 'bg-blue-800 text-white' : 'bg-orange-500 text-white'}>
              <tr>
                <th className="px-4 py-2 text-center">Nombre</th>
                <th className="px-4 py-2 text-center">Almacén</th>
                <th className="px-4 py-2 text-center">Cantidad</th>
                <th className="px-4 py-2 text-center">Fecha de Entrada</th>
                <th className="px-4 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovimientos.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 border-t">
                  <td className="px-4 py-2 text-center">{m.nombre}</td>
                  <td className="px-4 py-2 text-center">{m.almacen}</td>
                  <td className="px-4 py-2 text-center">{m.cantidad}</td>
                  <td className="px-4 py-2 text-center">{m.fechaEntrada}</td>
                  <td className="px-4 py-2 flex justify-center space-x-2">
                    <button
                      onClick={() => setEditing(m)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => {/* handle delete aquí */}}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default WarehouseView;