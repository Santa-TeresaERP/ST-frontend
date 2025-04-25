import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import ModalCreateCategoria from './modal-create-categoria';
import ModalDeleteProducto from './modal-delete-producto'; // Modal de eliminación
import ModalEditProducto from './modal-edit-producto'; // Modal de edición

const ProductosView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Control del modal de categoría
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Control del modal de eliminación
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Control del modal de edición
  const [productoAEliminar, setProductoAEliminar] = useState<number | null>(null); // Producto seleccionado para eliminar
  const [productoAEditar, setProductoAEditar] = useState<any>(null); // Producto seleccionado para editar
  const productos = [
    { id: 1, nombre: 'Producto A', categoria: 'Categoría 1', precio: 25.5, stock: 100 },
    { id: 2, nombre: 'Producto B', categoria: 'Categoría 2', precio: 40.0, stock: 80 },
    { id: 3, nombre: 'Producto C', categoria: 'Categoría 3', precio: 15.75, stock: 60 },
  ];

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openDeleteModal = (id: number) => {
    setProductoAEliminar(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductoAEliminar(null);
  };

  const openEditModal = (producto: any) => {
    setProductoAEditar(producto);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setProductoAEditar(null);
  };

  const eliminarProducto = () => {
    if (productoAEliminar !== null) {
      const nuevosProductos = productos.filter((producto) => producto.id !== productoAEliminar);
      console.log(`Producto con ID ${productoAEliminar} eliminado.`);
      setIsDeleteModalOpen(false);
      setProductoAEliminar(null);
    }
  };

  const saveProduct = (productoEditado: any) => {
    const nuevosProductos = productos.map((producto) =>
      producto.id === productoEditado.id ? productoEditado : producto
    );
    console.log('Producto editado:', productoEditado);
    setIsEditModalOpen(false);
    setProductoAEditar(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-4">Gestión de Productos</h1>
      <div className="w-24 h-1 bg-red-600 mx-auto mb-8" />

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

      <div className="flex justify-end space-x-6 mb-6 max-w-6xl mx-auto">
        <button
          onClick={openModal}
          className="bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-all duration-300 transform hover:scale-105"
        >
          Categorías
        </button>
        <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-all duration-300 transform hover:scale-105">
          Registrar Producto
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-2xl rounded-xl max-w-6xl mx-auto">
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-200 text-gray-800 uppercase text-xs shadow-md">
            <tr>
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4">Precio</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id} className="border-b border-gray-200">
                <td className="px-6 py-4">{producto.nombre}</td>
                <td className="px-6 py-4">{producto.categoria}</td>
                <td className="px-6 py-4">{producto.precio} $</td>
                <td className="px-6 py-4">{producto.stock}</td>
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => openEditModal(producto)}>
                    <Pencil className="text-blue-600 cursor-pointer hover:text-blue-800" />
                  </button>
                  <button onClick={() => openDeleteModal(producto.id)}>
                    <Trash2 className="text-red-600 cursor-pointer hover:text-red-800" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalCreateCategoria isOpen={isModalOpen} onClose={closeModal} />
      <ModalDeleteProducto isOpen={isDeleteModalOpen} onClose={closeDeleteModal} onDelete={eliminarProducto} />
      <ModalEditProducto
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        producto={productoAEditar}
        onSave={saveProduct}
      />
    </div>
  );
};

export default ProductosView;
