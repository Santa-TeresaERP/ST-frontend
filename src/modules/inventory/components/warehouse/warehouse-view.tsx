import React, { useState } from 'react';
import { Filter, Edit, Trash, Home } from 'lucide-react';
import ModalCreateProductWarehouse from './product/modal-create-product-warehouse';
import ModalEditProductWarehouse from './product/modal-edit-product-warehouse';
import ModalDeleteProductWarehouse from './product/modal-delete-product-warehouse';
import ModalNuevoRecurso from './resource/modal-create-resource-warehouse';
import ModalEditResource from './resource/modal-edit-resource-warehouse';
import ModalDeleteResource from './resource/modal-delete-resource-warehouse';

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
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'producto' | 'recurso'>('todos');
  const [agregarTipo, setAgregarTipo] = useState<'producto' | 'recurso'>('producto');
  const [isModalProductOpen, setIsModalProductOpen] = useState(false);
  const [isModalResourceOpen, setIsModalResourceOpen] = useState(false);
  const [productoEditar, setProductoEditar] = useState<Movement | null>(null);
  const [recursoEditar, setRecursoEditar] = useState<Movement | null>(null);
  const [movimientoEliminar, setMovimientoEliminar] = useState<Movement | null>(null);

  const movimientosFiltrados = movimientos.filter((m) =>
    filtroTipo === 'todos' ? true : m.tipo === filtroTipo
  );

  const handleEdit = (id: number) => {
    const movimiento = movimientos.find((m) => m.id === id);
    if (movimiento) {
      if (movimiento.tipo === 'producto') {
        setProductoEditar(movimiento);
        setRecursoEditar(null);
      } else {
        setRecursoEditar(movimiento);
        setProductoEditar(null);
      }
    }
  };

  const handleDelete = (id: number) => {
    const movimiento = movimientos.find((m) => m.id === id);
    if (movimiento) setMovimientoEliminar(movimiento);
  };

  const confirmDelete = () => {
    if (movimientoEliminar) {
      setMovimientos(prev => prev.filter(m => m.id !== movimientoEliminar.id));
      setMovimientoEliminar(null);
    }
  };

  const cancelDelete = () => setMovimientoEliminar(null);

  const toggleAgregarTipo = (tipo: 'producto' | 'recurso') => {
    setAgregarTipo(tipo);
    if (tipo === 'producto') {
      setIsModalProductOpen(true);
      setIsModalResourceOpen(false);
    } else {
      setIsModalResourceOpen(true);
      setIsModalProductOpen(false);
    }
  };

  const handleCreateProduct = (producto: { nombre: string; cantidad: number; almacen: string }) => {
    const nuevoMovimiento: Movement = {
      id: movimientos.length > 0 ? Math.max(...movimientos.map(m => m.id)) + 1 : 1,
      tipo: 'producto',
      nombre: producto.nombre,
      cantidad: producto.cantidad,
      almacen: producto.almacen,
      fechaEntrada: new Date().toISOString().slice(0, 10),
    };
    setMovimientos(prev => [...prev, nuevoMovimiento]);
    setIsModalProductOpen(false);
  };

  const handleCreateResource = (recurso: { nombre: string; cantidad: number; almacen: string }) => {
    const nuevoMovimiento: Movement = {
      id: movimientos.length > 0 ? Math.max(...movimientos.map(m => m.id)) + 1 : 1,
      tipo: 'recurso',
      nombre: recurso.nombre,
      cantidad: recurso.cantidad,
      almacen: recurso.almacen,
      fechaEntrada: new Date().toISOString().slice(0, 10),
    };
    setMovimientos(prev => [...prev, nuevoMovimiento]);
    setIsModalResourceOpen(false);
  };

  const handleUpdateProduct = (productoActualizado: Movement) => {
    setMovimientos(prev =>
      prev.map(m =>
        m.id === productoActualizado.id
          ? { ...productoActualizado, tipo: 'producto' }
          : m
      )
    );
    setProductoEditar(null);
  };

  const handleUpdateResource = (recursoActualizado: Movement) => {
    setMovimientos(prev =>
      prev.map(m =>
        m.id === recursoActualizado.id
          ? { ...recursoActualizado, tipo: 'recurso' }
          : m
      )
    );
    setRecursoEditar(null);
  };

  return (
    <div className="p-6 space-y-4 bg-gray-50 min-h-screen">
      <div className="flex justify-start">
        <h2 className="text-3xl font-semibold text-blue-700">Movimientos de Almacén</h2>
      </div>

      <div className="flex items-center space-x-2 text-gray-600">
        <Home size={24} className="text-blue-700" />
        <span className="text-lg font-medium">Gestión de movimientos del almacén</span>
      </div>

      <div className="flex justify-end items-center space-x-6">
        <div className="flex items-center space-x-3 select-none">
          <span className="text-gray-700 font-medium">Agregar:</span>
          <button
            onClick={() => toggleAgregarTipo('producto')}
            className={`px-4 py-2 rounded-full font-semibold transition-colors duration-300
              ${agregarTipo === 'producto' ? 'bg-red-700 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
          >
            Producto
          </button>
          <button
            onClick={() => toggleAgregarTipo('recurso')}
            className={`px-4 py-2 rounded-full font-semibold transition-colors duration-300
              ${agregarTipo === 'recurso' ? 'bg-red-700 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
          >
            Recurso
          </button>
        </div>

        <div className="relative inline-flex items-center shadow-sm rounded-xl bg-white">
          <Filter className="absolute left-4 text-red-700 pointer-events-none" size={20} />
          <select
            className="pl-11 pr-6 py-3 rounded-xl border border-red-700 text-gray-700 text-base
                       focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent
                       hover:bg-gray-200 transition duration-300 cursor-pointer appearance-none min-w-[160px]"
            value={filtroTipo}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e) => setFiltroTipo(e.target.value as any)}
          >
            <option value="todos">Todos</option>
            <option value="producto">Productos</option>
            <option value="recurso">Recursos</option>
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-red-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 text-center">Nombre</th>
              <th className="px-4 py-2 text-center">Almacén</th>
              <th className="px-4 py-2 text-center">Cantidad</th>
              <th className="px-4 py-2 text-center">Fecha de Entrada</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {movimientosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No hay movimientos para mostrar.
                </td>
              </tr>
            ) : (
              movimientosFiltrados.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 border-t">
                  <td className="px-4 py-2 text-center">{m.nombre}</td>
                  <td className="px-4 py-2 text-center">{m.almacen}</td>
                  <td className="px-4 py-2 text-center">{m.cantidad}</td>
                  <td className="px-4 py-2 text-center">{m.fechaEntrada}</td>
                  <td className="px-4 py-2 flex justify-center space-x-2">
                    <button
                      onClick={() => handleEdit(m.id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Crear Producto */}
      {isModalProductOpen && (
        <ModalCreateProductWarehouse
          isOpen={isModalProductOpen}
          onClose={() => setIsModalProductOpen(false)}
          onCreate={handleCreateProduct}
        />
      )}

      {/* Modal Crear Recurso */}
      {isModalResourceOpen && (
        <ModalNuevoRecurso
          isOpen={isModalResourceOpen}
          onClose={() => setIsModalResourceOpen(false)}
          onCreate={handleCreateResource}
        />
      )}

      {/* Modal Editar Producto */}
      {productoEditar && (
        <ModalEditProductWarehouse
          isOpen={!!productoEditar}
          onClose={() => setProductoEditar(null)}
          producto={productoEditar}
          onUpdate={handleUpdateProduct}
        />
      )}

      {/* Modal Editar Recurso */}
      {recursoEditar && (
        <ModalEditResource
          isOpen={!!recursoEditar}
          onClose={() => setRecursoEditar(null)}
          recurso={recursoEditar}
          onUpdate={handleUpdateResource}
        />
      )}

      {/* Modal Eliminar Producto o Recurso */}
      {movimientoEliminar && movimientoEliminar.tipo === 'producto' && (
        <ModalDeleteProductWarehouse
          isOpen={!!movimientoEliminar}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          productName={movimientoEliminar.nombre}
        />
      )}

      {movimientoEliminar && movimientoEliminar.tipo === 'recurso' && (
        <ModalDeleteResource
          isOpen={!!movimientoEliminar}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          resourceName={movimientoEliminar.nombre}
        />
      )}
    </div>
  );
};

export default WarehouseView;
