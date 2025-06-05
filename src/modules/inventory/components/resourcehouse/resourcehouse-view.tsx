import React, { useState, useMemo } from 'react';
import { FiEdit2, FiTrash2, FiFileText, FiSearch } from 'react-icons/fi';
import ModalNuevoRecurso from './resource/modal-create-resource-resourcehouse';
import ModalEditResource from './resource/modal-edit-resource-resourcehouse';
import ModalDeleteResource from './resource/modal-delete-resource-resourcehouse';

type Resource = {
  id: number;
  nombre: string;
  cantidad: number;
  unidad: string;
  precioUnitario: number;
  precioTotal: number;
  proveedor: string;
  fechaEntrada: string;
};

const initialResources: Resource[] = [
  { id: 1, nombre: 'Mano de Obra', unidad: 'horas', cantidad: 8, precioUnitario: 150, precioTotal: 1200, proveedor: 'Contratistas SAC', fechaEntrada: '2025-05-17' },
  { id: 2, nombre: 'Materiales de construcción', unidad: 'kilogramos', cantidad: 50, precioUnitario: 80, precioTotal: 4000, proveedor: 'Constructores SA', fechaEntrada: '2025-05-18' },
];

const ResourcesView: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);
  const [resourceToEdit, setResourceToEdit] = useState<Resource | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar recursos basados en el término de búsqueda
  const filteredResources = useMemo(() => {
    return resources.filter(resource =>
      resource.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.proveedor.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [resources, searchTerm]);

  const handleEdit = (id: number) => {
    const item = resources.find((r) => r.id === id);
    if (item) {
      setResourceToEdit(item);
    }
  };

  const handleDelete = (id: number) => {
    const item = resources.find((r) => r.id === id);
    if (item) {
      setResourceToDelete(item);
    }
  };

  const confirmDelete = () => {
    if (resourceToDelete) {
      setResources(prev => prev.filter(r => r.id !== resourceToDelete.id));
      setResourceToDelete(null);
    }
  };

  const cancelDelete = () => {
    setResourceToDelete(null);
  };

  const handleCreateResource = (recurso: { 
    nombre: string; 
    unidad: string; 
    precioUnitario: number;
    precioTotal?: number;
    proveedor: string;
    fechaCompra: string;
    cantidad: number;
  }) => {
    const nuevoRecurso: Resource = {
      id: resources.length > 0 ? Math.max(...resources.map(r => r.id)) + 1 : 1,
      nombre: recurso.nombre,
      cantidad: recurso.cantidad,
      unidad: recurso.unidad,
      precioUnitario: recurso.precioUnitario,
      precioTotal: recurso.precioTotal ?? recurso.precioUnitario * recurso.cantidad,
      proveedor: recurso.proveedor,
      fechaEntrada: recurso.fechaCompra || new Date().toISOString().slice(0, 10),
    };
    setResources(prev => [...prev, nuevoRecurso]);
    setIsModalOpen(false);
  };

  const handleUpdateResource = (recursoActualizado: {
    id: number;
    nombre: string;
    unidad: string;
    cantidad: number;
    precioUnitario: number;
    proveedor: string;
    fechaCompra: string;
  }) => {
    setResources(prev =>
      prev.map(r => 
        r.id === recursoActualizado.id 
          ? {
              ...r,
              nombre: recursoActualizado.nombre,
              unidad: recursoActualizado.unidad,
              cantidad: recursoActualizado.cantidad,
              precioUnitario: recursoActualizado.precioUnitario,
              precioTotal: recursoActualizado.precioUnitario * recursoActualizado.cantidad,
              proveedor: recursoActualizado.proveedor,
              fechaEntrada: recursoActualizado.fechaCompra
            } 
          : r
      )
    );
    setResourceToEdit(null);
  };

  return (
    <div className="p-6 space-y-4 bg-gray-50 min-h-screen">
      <div className="flex justify-start">
        <h2 className="text-4xl font-semibold text-yellow-500">
          Recursos
        </h2>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FiFileText size={24} className="text-yellow-500" />
          <span className="text-lg font-medium">Gestión de Recursos</span>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition flex items-center gap-2"
        >
          Agregar Recurso
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          placeholder="Buscar recursos por nombre o proveedor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Unidades</th>
              <th className="px-4 py-2 text-left">Cantidad</th>
              <th className="px-4 py-2 text-left">Precio Unitario</th>
              <th className="px-4 py-2 text-left">Precio Total</th>
              <th className="px-4 py-2 text-left">Proveedor</th>
              <th className="px-4 py-2 text-left">Fecha de Compra</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredResources.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  {searchTerm ? 'No se encontraron recursos que coincidan con la búsqueda' : 'No hay recursos para mostrar.'}
                </td>
              </tr>
            ) : (
              filteredResources.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 border-t">
                  <td className="px-4 py-2 text-left">{r.nombre}</td>
                  <td className="px-4 py-2 text-left">{r.unidad}</td>
                  <td className="px-4 py-2 text-left">{r.cantidad}</td>
                  <td className="px-4 py-2 text-left">
                    {`S/ ${r.precioUnitario.toFixed(2)}`}
                  </td>
                  <td className="px-4 py-2 text-left">
                    {`S/ ${r.precioTotal.toFixed(2)}`}
                  </td>
                  <td className="px-4 py-2 text-left">{r.proveedor}</td>
                  <td className="px-4 py-2 text-left">{r.fechaEntrada}</td>
                  <td className="px-4 py-2 text-left space-x-2">
                    <button
                      onClick={() => handleEdit(r.id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modales */}
      {isModalOpen && (
        <ModalNuevoRecurso
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateResource}
        />
      )}

      {resourceToEdit && (
        <ModalEditResource
          recurso={resourceToEdit}
          onClose={() => setResourceToEdit(null)}
          onUpdate={handleUpdateResource}
        />
      )}

      {resourceToDelete && (
        <ModalDeleteResource
          isOpen={!!resourceToDelete}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          resourceName={resourceToDelete.nombre}
        />
      )}
    </div>
  );
};

export default ResourcesView;