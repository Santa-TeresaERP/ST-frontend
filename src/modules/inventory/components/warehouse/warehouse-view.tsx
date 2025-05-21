import React, { useState } from 'react';
import { FiFilter, FiEdit2, FiTrash2, FiPackage, FiFileText } from 'react-icons/fi';
import ModalCreateProductWarehouse from './product/modal-create-product-warehouse';
import ModalEditProductWarehouse from './product/modal-edit-product-warehouse';
import ModalDeleteProductWarehouse from './product/modal-delete-product-warehouse';
import ModalNuevoRecurso from './resource/modal-create-resource-warehouse';
import ModalDeleteResource from './resource/modal-delete-resource-warehouse';
import ModalEditResource from './resource/modal-edit-resource-warehouse';

type Movement = {
  id: number;
  tipo: 'producto' | 'recurso';
  nombre: string;
  almacen: string;
  cantidad: number;
  precioUnitario?: number;
  precioTotal?: number;
  proveedor?: string;
  fechaEntrada: string;
};

const initialMovimientos: Movement[] = [
  { id: 1, tipo: 'producto', nombre: 'Harina de Trigo', almacen: 'Cerro Colorado', cantidad: 150, fechaEntrada: '2025-05-15' },
  { id: 2, tipo: 'recurso', nombre: 'Mano de Obra', almacen: 'Santa Catalina', cantidad: 8, precioUnitario: 150, precioTotal: 158, proveedor: 'Contratistas SAC', fechaEntrada: '2025-05-17' },
  { id: 3, tipo: 'producto', nombre: 'Azúcar', almacen: 'San Juan', cantidad: 300, fechaEntrada: '2025-05-18' },
];

type ViewType = 'productos' | 'recursos';

const WarehouseView: React.FC = () => {
  const [movimientos, setMovimientos] = useState<Movement[]>(initialMovimientos);
  const [currentView, setCurrentView] = useState<ViewType>('productos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [productoEditar, setProductoEditar] = useState<Movement | null>(null);
  const [productoEliminar, setProductoEliminar] = useState<Movement | null>(null);
  const [recursoEliminar, setRecursoEliminar] = useState<Movement | null>(null);
  const [recursoEditar, setRecursoEditar] = useState<Movement | null>(null);

  // Filtrar movimientos según la vista actual
  const movimientosFiltrados = movimientos.filter((m) => 
    currentView === 'productos' ? m.tipo === 'producto' : m.tipo === 'recurso'
  );

  const handleEdit = (id: number) => {
    const item = movimientos.find((m) => m.id === id);
    if (item) {
      if (currentView === 'productos') {
        setProductoEditar(item);
      } else {
        setRecursoEditar(item);
      }
    }
  };

  const handleDelete = (id: number) => {
    const item = movimientos.find((m) => m.id === id);
    if (item) {
      if (currentView === 'productos') {
        setProductoEliminar(item);
      } else {
        setRecursoEliminar(item);
      }
    }
  };

  const confirmDelete = () => {
    if (productoEliminar) {
      setMovimientos(prev => prev.filter(m => m.id !== productoEliminar.id));
      setProductoEliminar(null);
    }
    if (recursoEliminar) {
      setMovimientos(prev => prev.filter(m => m.id !== recursoEliminar.id));
      setRecursoEliminar(null);
    }
  };

  const confirmDeleteResource = () => {
    if (recursoEliminar) {
      setMovimientos(prev => prev.filter(m => m.id !== recursoEliminar.id));
      setRecursoEliminar(null);
    }
  };

  const cancelDelete = () => {
    setProductoEliminar(null);
    setRecursoEliminar(null);
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
    setIsModalOpen(false);
  };

  const handleCreateResource = (recurso: { 
    nombre: string; 
    unidad: number; 
    precioUnitario: number;
    precioTotal?: number;
    proveedor: string;
    fechaCompra: string;
  }) => {
    const nuevoMovimiento: Movement = {
      id: movimientos.length > 0 ? Math.max(...movimientos.map(m => m.id)) + 1 : 1,
      tipo: 'recurso',
      nombre: recurso.nombre,
      cantidad: recurso.unidad,
      precioUnitario: recurso.precioUnitario,
      precioTotal: recurso.precioUnitario * recurso.unidad,
      proveedor: recurso.proveedor,
      almacen: 'N/A', // O puedes cambiarlo según necesites
      fechaEntrada: recurso.fechaCompra || new Date().toISOString().slice(0, 10),
    };
    setMovimientos(prev => [...prev, nuevoMovimiento]);
    setIsResourceModalOpen(false);
  };

  

  const handleUpdateProduct = (productoActualizado: {
    id: number;
    nombre: string;
    cantidad: number;
    almacen: string;
  }) => {
    setMovimientos(prev =>
      prev.map(m => 
        m.id === productoActualizado.id 
          ? {
              ...m,
              nombre: productoActualizado.nombre,
              cantidad: productoActualizado.cantidad,
              almacen: productoActualizado.almacen
            } 
          : m
      )
    );
    setProductoEditar(null);
  };

  const handleUpdateResource = (recursoActualizado: {
    id: number;
    nombre: string;
    unidad: number;
    precioUnitario: number;
    precioTotal?: number;
    proveedor: string;
    fechaCompra: string;
  }) => {
    setMovimientos(prev =>
      prev.map(m => 
        m.id === recursoActualizado.id 
          ? {
              ...m,
              nombre: recursoActualizado.nombre,
              cantidad: recursoActualizado.unidad,
              precioUnitario: recursoActualizado.precioUnitario,
              precioTotal: recursoActualizado.precioTotal,
              proveedor: recursoActualizado.proveedor,
              fechaEntrada: recursoActualizado.fechaCompra
            } 
          : m
      )
    );
    setRecursoEditar(null);
  };

  return (
    <div className="p-6 space-y-4 bg-gray-50 min-h-screen">
      <div className="flex justify-start">
        <h2 className="text-3xl font-semibold text-blue-800">
          {currentView === 'productos' ? 'Productos en Almacén' : 'Recursos en Almacén'}
        </h2>
      </div>

      {/* Barra de navegación */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2 bg-white p-1 rounded-lg shadow-sm">
          <button
            onClick={() => setCurrentView('productos')}
            className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-colors ${
              currentView === 'productos' 
                ? 'bg-red-700 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FiPackage size={18} />
            <span>Productos</span>
          </button>
          <button
            onClick={() => setCurrentView('recursos')}
            className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-colors ${
              currentView === 'recursos' 
                ? 'bg-red-700 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FiFileText size={18} />
            <span>Recursos</span>
          </button>
        </div>

        {/* Botón de agregar */}
        <button
          onClick={() => currentView === 'productos' ? setIsModalOpen(true) : setIsResourceModalOpen(true)}
          className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition flex items-center gap-2"
        >
          {currentView === 'productos' ? 'Agregar Producto' : 'Agregar Recurso'}
        </button>
      </div>

      {/* Tabla de productos */}
      {currentView === 'productos' && (
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Almacén</th>
                <th className="px-4 py-2 text-right">Cantidad</th>
                <th className="px-4 py-2 text-left">Fecha de Entrada</th>
                <th className="px-4 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {movimientosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No hay productos para mostrar.
                  </td>
                </tr>
              ) : (
                movimientosFiltrados.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 border-t">
                    <td className="px-4 py-2">{m.nombre}</td>
                    <td className="px-4 py-2">{m.almacen}</td>
                    <td className="px-4 py-2 text-right">{m.cantidad}</td>
                    <td className="px-4 py-2">{m.fechaEntrada}</td>
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
      )}

      {/* Tabla de recursos */}
      {currentView === 'recursos' && (
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Unidades</th>
                <th className="px-4 py-2 text-left">Precio Unitario</th>
                <th className="px-4 py-2 text-left">Precio Total</th>
                <th className="px-4 py-2 text-left">Proveedor</th>
                <th className="px-4 py-2 text-left">Fecha de Compra</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {movimientosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No hay recursos para mostrar.
                  </td>
                </tr>
              ) : (
                movimientosFiltrados.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 border-t">
                    <td className="px-4 py-2 text-left">{m.nombre}</td>
                    <td className="px-4 py-2 text-left">{m.cantidad}</td>
                    <td className="px-4 py-2 text-left">
                      {m.precioUnitario ? `S/ ${m.precioUnitario.toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="px-4 py-2 text-left">
                      {m.precioTotal ? `S/ ${m.precioTotal.toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="px-4 py-2 text-left">{m.proveedor || 'N/A'}</td>
                    <td className="px-4 py-2 text-left">{m.fechaEntrada}</td>
                    <td className="px-4 py-2 text-left space-x-2">
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
      )}

      {/* Modales */}
      {isModalOpen && (
        <ModalCreateProductWarehouse
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateProduct}
        />
      )}

      {isResourceModalOpen && (
        <ModalNuevoRecurso
          onClose={() => setIsResourceModalOpen(false)}
          onCreate={handleCreateResource}
        />
      )}

      {productoEditar && (
        <ModalEditProductWarehouse
          producto={productoEditar}
          onClose={() => setProductoEditar(null)}
          onUpdate={handleUpdateProduct}
        />
      )}

      {(productoEliminar || recursoEliminar) && (
        <ModalDeleteProductWarehouse
          isOpen={!!(productoEliminar || recursoEliminar)}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          productName={(productoEliminar || recursoEliminar)?.nombre || ''}
        />
      )}

      {recursoEditar && (
        <ModalEditResource
          recurso={recursoEditar}
          onClose={() => setRecursoEditar(null)}
          onUpdate={handleUpdateResource}
        />
      )}

      {recursoEliminar && (
        <ModalDeleteResource
          isOpen={!!recursoEliminar}
          onClose={() => setRecursoEliminar(null)}
          onConfirm={confirmDeleteResource}
          resourceName={recursoEliminar.nombre}
        />
      )}
    </div>
  );
};

export default WarehouseView;