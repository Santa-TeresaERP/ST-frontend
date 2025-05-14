import { useState } from 'react';
import { Trash2, Edit, List, Plus, Loader2, AlertTriangle } from 'lucide-react';
import ModalDeleteProducto from './modal-delete-product';
import ModalEditProducto from './modal-edit-product';
import ModalCreateProducto from './modal-create-product';
import ModalCreateCategoria from './modal-create-category';
import { useFetchProducts, useDeleteProduct } from '@/modules/production/hook/useProducts';
import { useFetchProductions } from '@/modules/production/hook/useProductions';
import { FiBox } from 'react-icons/fi';
import { Tooltip } from '@/app/components/ui/tooltip';

const ProductosView = () => {
  const { data: productos, isLoading, error } = useFetchProducts();
  const { data: producciones } = useFetchProductions();
  const deleteProductMutation = useDeleteProduct();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
    description: string;
    price: number;
    category_id: string;
    imagen_url: string;
  } | null>(null);

  // Verificar si el producto está vinculado a una producción
  const isProductLinkedToProduction = (productId: string): boolean => {
    return producciones?.some((production) => production.productId === productId) || false;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDeleteClick = (product: any) => {
    if (isProductLinkedToProduction(product.id)) {
      return; // No hacer nada si está vinculado
    }
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-red-600" />
      </div>
    );
    
    const handleDeleteProduct = async (productId: string) => {
      if (isProductLinkedToProduction(productId)) {
        alert('No se puede eliminar este producto porque está vinculado a una producción.');
        return;
      }
    
      try {
        await deleteProductMutation.mutateAsync(productId);
        setIsDeleteModalOpen(false); // Cerrar el modal
        setSelectedProduct(null); // Limpiar el producto seleccionado
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        alert('Hubo un error al intentar eliminar el producto.');
      }
    };

  if (error)
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mx-6 my-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error al cargar los productos</h3>
            <p className="text-sm text-red-700 mt-1">Por favor, intenta nuevamente más tarde.</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold pb-4 flex text-blue-500 items-center gap-2">
            <FiBox size={24} />
            <span>Gestión de Productos</span>
          </h1>
          <p className="text-gray-500 mt-1">Administra tu catálogo de productos</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-700 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-500 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Plus size={18} />
            <span>Crear Producto</span>
          </button>
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-500 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <List size={18} />
            <span>Ver Categorías</span>
          </button>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productos?.map((producto) => {
          const isLinked = isProductLinkedToProduction(producto.id);
          
          return (
            <div
              key={producto.id}
              className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border ${
                isLinked ? 'border-yellow-200' : 'border-gray-100'
              } relative`}
            >
              {isLinked && (
                <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <AlertTriangle size={14} />
                  <span>En producción</span>
                </div>
              )}

              {/* Imagen del producto */}
              <div className="h-48 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                {producto.imagen_url ? (
                  <img
                    src={producto.imagen_url}
                    alt={producto.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <svg
                    className="h-20 w-20 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {producto.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {producto.description}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    S/. {(Number(producto.price) || 0).toFixed(2)}
                  </span>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setSelectedProduct({
                        ...producto,
                        category_id: producto.category_id || '',
                        imagen_url: producto.imagen_url || '',
                      });
                      setIsEditModalOpen(true);
                    }}
                    className="p-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  
                  <Tooltip 
                    content={isLinked ? "Este producto no puede eliminarse porque está en producción" : "Eliminar producto"}
                    side="top"
                  >
                    <button
                      onClick={() => handleDeleteClick(producto)}
                      disabled={isLinked}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        isLinked
                          ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                          : 'text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100'
                      }`}
                      title={isLinked ? "No se puede eliminar" : "Eliminar"}
                    >
                      <Trash2 size={18} />
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modales */}
      <ModalCreateProducto
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <ModalEditProducto
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        producto={selectedProduct}
      />
      <ModalDeleteProducto
  isOpen={isDeleteModalOpen}
  onClose={() => {
    setIsDeleteModalOpen(false);
    setSelectedProduct(null); // Limpiar el producto seleccionado al cerrar el modal
  }}
  onConfirm={() => {
    if (selectedProduct?.id) {
      handleDeleteProduct(selectedProduct.id); // Llamar a la función de eliminación
    }
  }}
/>
      <ModalCreateCategoria
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </div>
  );
};

export default ProductosView;