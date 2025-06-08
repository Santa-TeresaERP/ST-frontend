import { useState, useEffect } from 'react'; // Agregado useEffect para sincronizar datos
import { Trash2, Edit, List, Plus, Loader2, AlertTriangle } from 'lucide-react';
import ModalDeleteProducto from './modal-delete-product';
import ModalEditProducto from './modal-edit-product';
import ModalCreateProducto from './modal-create-product';
import ModalCreateCategoria from './modal-create-category';
import { useFetchProducts, useDeleteProduct } from '@/modules/production/hook/useProducts';
import { useFetchProductions } from '@/modules/production/hook/useProductions';
import { useFetchCategories } from '@/modules/production/hook/useCategories'; // Importado para obtener categorías
import { FiBox } from 'react-icons/fi';
import { Tooltip } from '@/app/components/ui/tooltip';
import ModalFilterProduct from './modal-filter-product';

const ProductosView = () => {
  const { data: productos, isLoading, error } = useFetchProducts();
  const { data: producciones } = useFetchProductions();
  const { data: categories } = useFetchCategories(); // Hook para obtener categorías
  const deleteProductMutation = useDeleteProduct();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // Estado para el modal de filtros
  const [filteredProducts, setFilteredProducts] = useState<
    {
      id: string;
      name: string;
      createdAt: Date;
      category_id: string;
      price: number;
      description?: string;
      imagen_url?: string;
      updatedAt?: Date;
    }[]
  >([]); // Estado para los productos filtrados
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

  // Sincronizar productos filtrados con los datos originales cuando cambien
  useEffect(() => {
    setFilteredProducts(productos || []);
  }, [productos]); // Actualiza los productos filtrados cuando cambien los datos originales

  const isProductLinkedToProduction = (productId: string): boolean => {
    return producciones?.some(production => production.productId === productId) ?? false;
  };

  const handleApplyFilters = (filters: { startDate: string; endDate: string; category: string }) => {
    const { startDate, endDate, category } = filters;

    const filtered = productos?.filter((product) => {
      const productDate = new Date(product.createdAt); // Fecha de creación del producto
      const isWithinDateRange =
        (!startDate || productDate >= new Date(startDate)) &&
        (!endDate || productDate <= new Date(endDate));
      const matchesCategory = !category || product.category_id === category;

      return isWithinDateRange && matchesCategory;
    });

    setFilteredProducts(filtered || []);
  };

  const handleDeleteClick = (product: typeof selectedProduct) => {
    if (!product || isProductLinkedToProduction(product.id)) return;

    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (product: typeof selectedProduct) => {
    if (!product) return;

    setSelectedProduct({
      ...product,
      category_id: product.category_id || '',
      imagen_url: product.imagen_url || ''
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (isProductLinkedToProduction(productId)) {
      alert('No se puede eliminar este producto porque está vinculado a una producción.');
      return;
    }

    try {
      await deleteProductMutation.mutateAsync(productId);
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      alert('Hubo un error al intentar eliminar el producto.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-red-600" />
      </div>
    );
  }

  if (error) {
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
            <button
              onClick={() => window.location.reload()} // Botón para recargar la página
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header mejorado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-blue-600 flex items-center gap-3">
            <FiBox size={28} className="text-blue-500" />
            <span>Gestión de Productos</span>
          </h1>
          <p className="text-gray-600">Administra tu catálogo de productos</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex gap-3">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow hover:shadow-md"
            >
              <List size={18} />
              <span>Filtrar</span>
            </button>
            
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-500 hover:to-red-400 transition-all duration-300 shadow hover:shadow-md"
            >
              <Plus size={18} />
              <span>Nuevo Producto</span>
            </button>
            
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-600 to-gray-500 text-white rounded-lg hover:from-gray-500 hover:to-gray-400 transition-all duration-300 shadow hover:shadow-md"
            >
              <List size={18} />
              <span>Categorías</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      {filteredProducts.length === 0 ? ( // Mostrar mensaje si no hay productos filtrados
        <div className="text-center text-gray-500 mt-8">
          <p>No se encontraron productos que coincidan con los filtros aplicados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((producto) => {
            const isLinked = isProductLinkedToProduction(producto.id);

            return (
              <div
                key={producto.id}
                className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border ${
                  isLinked ? 'border-yellow-200 bg-yellow-50' : 'border-gray-100'
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
                    <Tooltip content="Editar producto" side="top">
                      <button
                        onClick={() =>
                          handleEditClick({
                            ...producto,
                            description: producto.description || '',
                            imagen_url: producto.imagen_url || '',
                          })
                        }
                        className="p-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                      >
                        <Edit size={18} />
                      </button>
                    </Tooltip>

                    <Tooltip
                      content={
                        isLinked
                          ? 'Este producto está en producción y no puede eliminarse'
                          : 'Eliminar producto'
                      }
                      side="top"
                    >
                      <button
                        onClick={() =>
                          handleDeleteClick({
                            ...producto,
                            description: producto.description || '',
                            imagen_url: producto.imagen_url || '',
                          })
                        }
                        disabled={isLinked}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          isLinked
                            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                            : 'text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100'
                        }`}
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
      )}

      {/* Modales */}
      <ModalFilterProduct
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        categories={categories || []} // Pasa las categorías disponibles
        onFilter={handleApplyFilters}
      />

      <ModalCreateProducto
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        categories={categories || []} // Pasa las categorías disponibles
      />

      <ModalEditProducto
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        producto={selectedProduct}
        categories={categories || []} // Pasa las categorías disponibles
      />

      <ModalDeleteProducto
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={() => {
          if (selectedProduct?.id) {
            handleDeleteProduct(selectedProduct.id);
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