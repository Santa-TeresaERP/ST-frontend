import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import ModalCreateCategoria from './modal-create-categoria';
import ModalDeleteProducto from './modal-delete-producto'; // Modal de eliminación
import ModalEditProducto from './modal-edit-producto'; // Modal de edición
import ModalCreateProducto from './modal-create-producto';
import { FiBox } from 'react-icons/fi';
import { FiEdit } from 'react-icons/fi';


const ProductosView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Control del modal de categoría
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Control del modal de eliminación
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Control del modal de edición
  const [productoAEliminar, setProductoAEliminar] = useState<number | null>(null); // Producto seleccionado para eliminar
  const [productoAEditar, setProductoAEditar] = useState<any>(null); // Producto seleccionado para editar
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [productos, setProductos] = useState([
    { id: 1, nombre: 'Producto A', categoria: 'Categoría 1', precio: 25.5, stock: 100, descripcion: 'Este es el producto A'},
    { id: 2, nombre: 'Producto B', categoria: 'Categoría 2', precio: 40.0, stock: 80, descripcion: 'Este es el producto B'},
    { id: 3, nombre: 'Producto C', categoria: 'Categoría 3', precio: 15.75, stock: 60, descripcion: 'Este es el producto C'},
  ]);
  
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const saveProductCreate = (nuevoProducto: any) => {
    setProductos([...productos, nuevoProducto]);
    console.log('Producto creado:', nuevoProducto);
    closeCreateModal();
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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

  const eliminarProducto = (id: number) => {
    if (id !== null) {
      const nuevosProductos = productos.filter((producto) => producto.id !== id);
      setProductos(nuevosProductos); // Actualizamos el estado con el nuevo arreglo sin el producto eliminado
      console.log(`Producto con ID ${id} eliminado.`);
      closeDeleteModal(); // Cerramos el modal de eliminación
    }
  };

  const saveProduct = (productoEditado: any) => {
    const nuevosProductos = productos.map((producto) =>
      producto.id === productoEditado.id ? productoEditado : producto
    );
    setProductos(nuevosProductos); // Actualizamos el estado con el producto editado
    console.log('Producto editado:', productoEditado);
    closeEditModal(); // Cerramos el modal de edición
  };

  return (
    <div className="p-6 w-full h-full">
      {/* Encabezado y botones */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2 w-full">
        <h2 className="text-3xl pb-4  font-bold text-blue-700 flex items-center">
          <FiBox className="mr-2" /> Gestión de Productos
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <button
            onClick={openModal}
            className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-all duration-300 w-full md:w-auto"
          >
            Categorías
          </button>
          <button
            onClick={openCreateModal}
            className="bg-white text-black border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-300 w-full flex items-center md:w-auto"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Registrar Producto
          </button>
        </div>
      </div>
  
      {/* Tabla de productos - Ocupa todo el espacio disponible */}
      <div className="w-full h-[calc(100%-120px)] overflow-auto bg-white shadow-lg rounded-lg">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-700 text-white uppercase text-xs sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left">Producto</th>
              <th className="px-4 py-3 text-left">Categoría</th>
              <th className="px-4 py-3 text-left">Precio</th>
              <th className="px-4 py-3 text-left">Descripción</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3">{producto.nombre}</td>
                <td className="px-4 py-3">{producto.categoria}</td>
                <td className="px-4 py-3">S/. {producto.precio}</td>
                <td className="px-4 py-3">{producto.descripcion}</td>
                <td className="px-4 py-3">{producto.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2 justify-center">
                    <button 
                      onClick={() => openEditModal(producto)}
                      className="p-1 hover:bg-blue-50 rounded-full text-green-600 hover:text-green-800"
                    >
                      <FiEdit />
                    </button>
                    <button 
                      onClick={() => openDeleteModal(producto.id)}
                      className="p-1 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="text-red-600 hover:text-red-800" size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* Modales */}
      <ModalCreateCategoria isOpen={isModalOpen} onClose={closeModal} />
      <ModalCreateProducto isOpen={isCreateModalOpen} onClose={closeCreateModal} onSave={saveProductCreate} />
      <ModalDeleteProducto isOpen={isDeleteModalOpen} onClose={closeDeleteModal} onConfirm={() => eliminarProducto(productoAEliminar!)} />
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