import React, { useState } from 'react';
import { FiFilter, FiEdit2, FiTrash2 } from 'react-icons/fi';
import ModalCreateProductWarehouse from './product/modal-create-product-warehouse';
import ModalEditProductWarehouse from './product/modal-edit-product-warehouse';
import ModalDeleteProductWarehouse from './product/modal-delete-product-warehouse';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productoEditar, setProductoEditar] = useState<Movement | null>(null);
  const [productoEliminar, setProductoEliminar] = useState<Movement | null>(null);

  const movimientosFiltrados = movimientos.filter((m) =>
    filtroTipo === 'todos' ? true : m.tipo === filtroTipo
  );

  const handleEdit = (id: number) => {
    const producto = movimientos.find((m) => m.id === id);
    if (producto) {
      setProductoEditar(producto);
    }
  };

  const handleDelete = (id: number) => {
    const producto = movimientos.find((m) => m.id === id);
    if (producto) {
      setProductoEliminar(producto);
    }
  };

  const confirmDeleteProduct = () => {
    if (productoEliminar) {
      setMovimientos(prev => prev.filter(m => m.id !== productoEliminar.id));
      setProductoEliminar(null);
    }
  };

  const cancelDeleteProduct = () => {
    setProductoEliminar(null);
  };

  const toggleAgregarTipo = (tipo: 'producto' | 'recurso') => {
    setAgregarTipo(tipo);
    if (tipo === 'producto') {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
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
  };

  const handleUpdateProduct = (productoActualizado: Movement) => {
    setMovimientos(prev =>
      prev.map(m => (m.id === productoActualizado.id ? productoActualizado : m))
    );
    setProductoEditar(null);
  };

  return (
    <div className="p-6 space-y-4 bg-gray-50 min-h-screen">

      <div className="flex justify-start">
        <h2 className="text-3xl font-semibold text-gray-800">Movimientos de Almacén</h2>
      </div>

      <div className="flex justify-end items-center space-x-6">
        {/* Switch Agregar */}
        <div className="flex items-center space-x-3 select-none">
          <span className="text-gray-700 font-medium">Agregar:</span>
          <button
            onClick={() => toggleAgregarTipo('producto')}
            className={`
              px-4 py-2 rounded-full
              font-semibold
              transition-colors duration-300
              ${agregarTipo === 'producto' ? 'bg-red-700 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}
            `}
            aria-label="Seleccionar Producto"
          >
            Producto
          </button>
          <button
            onClick={() => toggleAgregarTipo('recurso')}
            className={`
              px-4 py-2 rounded-full
              font-semibold
              transition-colors duration-300
              ${agregarTipo === 'recurso' ? 'bg-red-700 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}
            `}
            aria-label="Seleccionar Recurso"
          >
            Recurso
          </button>
        </div>

        {/* Filtro tipo */}
        <div className="relative inline-flex items-center shadow-sm rounded-xl bg-white">
          <FiFilter className="absolute left-4 text-red-700 pointer-events-none" size={20} />
          <select
            className="
              pl-11 pr-6 py-3
              rounded-xl
              border border-red-700
              text-gray-700 text-base
              focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent
              hover:bg-gray-200
              transition duration-300
              cursor-pointer
              appearance-none
              min-w-[160px]
            "
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as any)}
          >
            <option value="todos">Todos</option>
            <option value="producto">Productos</option>
            <option value="recurso">Recursos</option>
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-red-700">
            {/* Flecha personalizada */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tabla */}
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
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(m.id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
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

      {/* Modal para crear producto */}
      {isModalOpen && (
        <ModalCreateProductWarehouse
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateProduct}
        />
      )}

      {/* Modal para editar producto */}
      {productoEditar && (
        <ModalEditProductWarehouse
          producto={productoEditar}
          onClose={() => setProductoEditar(null)}
          onUpdate={handleUpdateProduct}
        />
      )}

      {/* Modal para eliminar producto */}
      {productoEliminar && (
        <ModalDeleteProductWarehouse
          isOpen={!!productoEliminar}
          onClose={cancelDeleteProduct}
          onConfirm={confirmDeleteProduct}
          productName={productoEliminar.nombre}
        />
      )}
    </div>
  );
};

export default WarehouseView;
