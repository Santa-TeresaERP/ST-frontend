import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import ModalCreateCategoria from './modal-create-categoria';  
import ModalDeleteProducto from './modal-delete-producto'; // Importamos el modal de eliminación

const ProductosView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Control del modal de categoría
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Control del modal de eliminación
  const [productoAEliminar, setProductoAEliminar] = useState<number | null>(null); // Producto seleccionado para eliminar
  const productos = [
    { id: 1, nombre: 'Producto A', categoria: 'Categoría 1', precio: 25.5, stock: 100 },
    { id: 2, nombre: 'Producto B', categoria: 'Categoría 2', precio: 40.0, stock: 80 },
    { id: 3, nombre: 'Producto C', categoria: 'Categoría 3', precio: 15.75, stock: 60 },
  ];

  // Función para abrir el modal de categoría
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Función para cerrar el modal de categoría
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Función para abrir el modal de eliminación
  const openDeleteModal = (id: number) => {
    setProductoAEliminar(id);
    setIsDeleteModalOpen(true);
  };

  // Función para cerrar el modal de eliminación
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductoAEliminar(null);
  };

  // Función para eliminar el producto
  const eliminarProducto = () => {
    if (productoAEliminar !== null) {
      const nuevosProductos = productos.filter((producto) => producto.id !== productoAEliminar);
      console.log(`Producto con ID ${productoAEliminar} eliminado.`);
      setIsDeleteModalOpen(false);
      setProductoAEliminar(null);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      {/* Título y línea divisoria */}
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-4">Gestión de Productos</h1>
      <div className="w-24 h-1 bg-red-600 mx-auto mb-8" />

      {/* Navegación superior */}
      <div className="flex justify-center space-x-6 mb-8">
        {['Producción', 'Productos', 'Pérdidas'].map((tab) => (
          <button
            key={tab}
            className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-all duration-300 transform hover:scale-105"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Botones secundarios */}
      <div className="flex justify-end space-x-6 mb-6 max-w-6xl mx-auto">
        <button
          onClick={openModal} // Aquí abres el modal al hacer clic
          className="bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-all duration-300 transform hover:scale-105"
        >
          Categorías
        </button>
        <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-all duration-300 transform hover:scale-105">
          Registrar Producto
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white shadow-2xl rounded-xl max-w-6xl mx-auto">
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-200 text-gray-800 uppercase text-xs shadow-md">
            <tr>
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4">Precio</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {productos.map((producto) => (
              <tr key={producto.id} className="hover:bg-gray-50 transition-all duration-300">
                <td className="px-6 py-4">{producto.nombre}</td>
                <td className="px-6 py-4">{producto.categoria}</td>
                <td className="px-6 py-4">${producto.precio.toFixed(2)}</td>
                <td className="px-6 py-4">{producto.stock}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center space-x-6">
                    <button className="text-black hover:text-gray-700 transition-all duration-300 transform hover:scale-105">
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(producto.id)} // Abrir modal de eliminación
                      className="text-red-600 hover:text-red-700 transition-all duration-300 transform hover:scale-105"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para crear categoría */}
      <ModalCreateCategoria isOpen={isModalOpen} onClose={closeModal} />

      {/* Modal de eliminación de producto */}
      <ModalDeleteProducto
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={eliminarProducto}
      />
    </div>
  );
};

export default ProductosView;
