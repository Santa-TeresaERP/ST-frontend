/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from 'react';
import { X, Save, Pencil, Trash2, Plus } from 'lucide-react';
import { FiShoppingCart, FiPackage } from 'react-icons/fi';
import { useUpdateSale } from '../../hooks/useSales';
import { useCreateSalesDetail, useUpdateSalesDetail, useDeleteSalesDetail, useFetchSalesDetails } from '../../hooks/useSalesDetails';
import { useFetchProducts } from '@/modules/production/hook/useProducts';
import { salesAttributes } from '../../types/sales';
import { Product as ProductType } from '@/modules/production/types/products';

// Interfaz para los productos en el carrito de edición
interface CartProduct {
  id?: string; // ID del detalle (para productos existentes)
  productId: string;
  nombre: string;
  precio: number;
  cantidad: number;
  total: number;
  isNew?: boolean; // Para identificar productos nuevos
}

interface ModalEditSalesProps {
  isOpen: boolean;
  onClose: () => void;
  currentSale: salesAttributes | null;
  onSave: () => void;
}

const ModalEditSales: React.FC<ModalEditSalesProps> = ({ isOpen, onClose, currentSale, onSave }) => {
  const updateSaleMutation = useUpdateSale();
  const createSalesDetail = useCreateSalesDetail();
  const updateSalesDetail = useUpdateSalesDetail();
  const deleteSalesDetail = useDeleteSalesDetail();
  
  // Hooks para datos
  const { data: allSalesDetails = [], isLoading: loadingSalesDetails } = useFetchSalesDetails();
  const { data: allProducts = [], isLoading: loadingProducts } = useFetchProducts();
  
  // Estados del formulario
  const [tienda, setTienda] = useState('');
  const [fecha, setFecha] = useState('');
  const [observacion, setObservacion] = useState('');
  const [localError, setLocalError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Estados para productos
  const [productos, setProductos] = useState<CartProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);

  // Memoizar los productos de la venta actual para evitar recálculos innecesarios
  const currentSaleDetails = useMemo(() => {
    if (!currentSale?.id || !allSalesDetails.length) return [];
    return allSalesDetails.filter(detail => detail.saleId === currentSale.id);
  }, [currentSale?.id, allSalesDetails]);

  // Función para obtener el precio del producto
  const getProductPrice = (product: ProductType): number => {
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    return isNaN(price) ? 0 : price;
  };

  // Función para obtener el nombre del producto por ID
  const getProductName = (productId: string) => {
    const product = allProducts.find(p => p.id === productId);
    return product?.name || 'Producto no encontrado';
  };

  // Calcular precio unitario desde el detalle
  const getUnitPriceFromDetail = (detail: any) => {
    if (detail.quantity && detail.quantity > 0) {
      return detail.mount / detail.quantity;
    }
    return 0;
  };

  // Efecto para marcar como montado (evitar hidratación)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    if (currentSale && !loadingSalesDetails && !loadingProducts && mounted) {
      // Cargar datos básicos de la venta
      setTienda(currentSale.store_id || '');
      // Formatear fecha para input date (YYYY-MM-DD)
      const formattedDate = currentSale.income_date ? 
        new Date(currentSale.income_date).toISOString().split('T')[0] : '';
      setFecha(formattedDate);
      setObservacion(currentSale.observations || '');
      setLocalError('');
      
      // Cargar productos existentes
      const productosExistentes: CartProduct[] = currentSaleDetails.map(detail => ({
        id: detail.id,
        productId: detail.productId,
        nombre: getProductName(detail.productId),
        precio: getUnitPriceFromDetail(detail),
        cantidad: Number(detail.quantity) || 0,
        total: Number(detail.mount) || 0,
        isNew: false
      }));
      
      setProductos(productosExistentes);
      
      // Limpiar estados de producto
      setSelectedProductId('');
      setCantidad('');
      setEditingIndex(null);
      setShowAddProduct(false);
    }
  }, [currentSale, currentSaleDetails, allProducts, loadingSalesDetails, loadingProducts, mounted]);

  // Obtener producto seleccionado para agregar
  const selectedProduct = allProducts.find(p => p.id === selectedProductId);
  const totalProductoActual = useMemo(() => {
    if (!selectedProduct || !cantidad) return 0;
    const cantidadNum = parseInt(cantidad || '0');
    return cantidadNum > 0 ? getProductPrice(selectedProduct) * cantidadNum : 0;
  }, [selectedProduct, cantidad]);

  // Funciones para manejar productos
  const handleAddOrUpdateProducto = () => {
    if (!selectedProductId || !cantidad || !selectedProduct) return;

    const cantidadNum = parseInt(cantidad);
    if (cantidadNum <= 0) return;

    const precio = getProductPrice(selectedProduct);
    const nuevoProducto: CartProduct = {
      productId: selectedProduct.id,
      nombre: selectedProduct.name || 'Producto sin nombre',
      precio: precio,
      cantidad: cantidadNum,
      total: precio * cantidadNum,
      isNew: true
    };

    let nuevosProductos: CartProduct[];
    if (editingIndex !== null) {
      nuevosProductos = [...productos];
      nuevosProductos[editingIndex] = { ...nuevosProductos[editingIndex], ...nuevoProducto };
    } else {
      // Verificar si el producto ya existe
      const existingIndex = productos.findIndex(p => p.productId === selectedProductId);
      if (existingIndex !== -1) {
        nuevosProductos = [...productos];
        nuevosProductos[existingIndex] = {
          ...nuevosProductos[existingIndex],
          cantidad: nuevosProductos[existingIndex].cantidad + cantidadNum,
          total: (nuevosProductos[existingIndex].cantidad + cantidadNum) * precio,
        };
      } else {
        nuevosProductos = [...productos, nuevoProducto];
      }
    }
    
    setProductos(nuevosProductos);
    setSelectedProductId('');
    setCantidad('');
    setEditingIndex(null);
    setShowAddProduct(false);
  };

  const handleEditProducto = (index: number) => {
    const prod = productos[index];
    setSelectedProductId(prod.productId);
    setCantidad(prod.cantidad.toString());
    setEditingIndex(index);
    setShowAddProduct(true);
  };

  const handleDeleteProducto = (index: number) => {
    const nuevosProductos = productos.filter((_, idx) => idx !== index);
    setProductos(nuevosProductos);
  };

  // Calcular total de la venta
  const totalVenta = useMemo(() => {
    return productos.reduce((sum, prod) => sum + (Number(prod.total) || 0), 0);
  }, [productos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!tienda || !fecha) {
      setLocalError('Por favor, completa los campos obligatorios.');
      return;
    }

    if (productos.length === 0) {
      setLocalError('Debe haber al menos un producto en la venta.');
      return;
    }

    if (!currentSale?.id) {
      setLocalError('Error: ID de venta no encontrado.');
      return;
    }

    setIsUpdating(true);

    try {
      // 1. Actualizar la venta principal
      const salePayload = {
        store_id: tienda.trim(),
        total_income: totalVenta,
        income_date: fecha,
        observations: observacion.trim()
      };

      await updateSaleMutation.mutateAsync({ id: currentSale.id, payload: salePayload });

      // 2. Procesar cambios en los productos
      // Eliminar productos que ya no están
      const productosAEliminar = currentSaleDetails.filter(
        detail => !productos.some(p => p.id === detail.id)
      );

      for (const detail of productosAEliminar) {
        if (detail.id) {
          await deleteSalesDetail.mutateAsync(detail.id);
        }
      }

      // Actualizar o crear productos
      for (const producto of productos) {
        if (producto.isNew || !producto.id) {
          // Crear nuevo detalle
          await createSalesDetail.mutateAsync({
            saleId: currentSale.id,
            productId: producto.productId,
            quantity: producto.cantidad,
            mount: producto.total
          });
        } else {
          // Actualizar detalle existente
          await updateSalesDetail.mutateAsync({
            id: producto.id,
            payload: {
              quantity: producto.cantidad,
              mount: producto.total
            }
          });
        }
      }

      // 3. Éxito - limpiar y cerrar
      onSave();
      onClose();
      setTienda('');
      setFecha('');
      setObservacion('');
      setProductos([]);
      setLocalError('');

    } catch (error) {
      console.error('Error updating sale:', error);
      setLocalError('Error al actualizar la venta. Por favor, inténtalo de nuevo.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    if (!isUpdating) {
      setLocalError('');
      setSelectedProductId('');
      setCantidad('');
      setEditingIndex(null);
      setShowAddProduct(false);
      onClose();
    }
  };

  // No renderizar hasta que esté montado (evita hidratación)
  if (!mounted) {
    return null;
  }

  if (!isOpen || !currentSale) return null;

  const isLoading = loadingSalesDetails || loadingProducts;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl relative mx-2 max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-5 rounded-t-2xl flex items-center justify-center relative gap-2">
          <FiShoppingCart size={24} />
          <h2 className="text-xl font-semibold text-center">Editar Venta</h2>
          <button
            onClick={handleClose}
            disabled={isUpdating}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 disabled:opacity-50"
          >
            <X size={22} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
            <div className="text-gray-500 ml-4">Cargando datos de la venta...</div>
          </div>
        ) : (
          <div className="p-6 flex flex-col lg:flex-row gap-6">
            {/* Formulario principal */}
            <form onSubmit={handleSubmit} className="lg:w-1/2 space-y-4 text-left">
              {localError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <p className="text-sm font-medium">{localError}</p>
                </div>
              )}

              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  ID de Tienda <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={tienda}
                  onChange={(e) => setTienda(e.target.value)}
                  disabled={isUpdating}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none disabled:bg-gray-100"
                  placeholder="UUID de la tienda"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Total de Ingresos
                </label>
                <input
                  type="text"
                  value={`S/ ${totalVenta.toFixed(2)}`}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">
                  Se calcula automáticamente según los productos
                </p>
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Fecha <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  disabled={isUpdating}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Observaciones
                </label>
                <textarea
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                  disabled={isUpdating}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none disabled:bg-gray-100"
                  placeholder="Observaciones adicionales..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUpdating || productos.length === 0}
                  className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="w-px bg-gray-300 hidden lg:block"></div>

            {/* Sección de productos */}
            <div className="lg:w-1/2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2">
                  <FiPackage size={18} /> Productos de la venta
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  disabled={isUpdating}
                  className="text-sm bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 flex items-center gap-1 disabled:opacity-50"
                >
                  <Plus size={14} />
                  {showAddProduct ? 'Cancelar' : 'Agregar'}
                </button>
              </div>

              {/* Formulario para agregar/editar productos */}
              {showAddProduct && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Producto *</label>
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      disabled={loadingProducts || isUpdating}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none disabled:bg-gray-100"
                    >
                      <option value="">
                        {loadingProducts ? 'Cargando productos...' : 'Seleccionar producto'}
                      </option>
                      {allProducts.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name || 'Sin nombre'} - S/ {getProductPrice(product).toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-700 mb-1">Cantidad *</label>
                      <input
                        type="number"
                        min="1"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        disabled={isUpdating}
                        placeholder="1"
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-700 mb-1">Total S/</label>
                      <input
                        type="text"
                        value={totalProductoActual.toFixed(2)}
                        className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
                        readOnly
                      />
                    </div>
                  </div>

                  {selectedProduct && (
                    <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                      <strong>{selectedProduct.name || 'Sin nombre'}</strong> - Precio: S/ {getProductPrice(selectedProduct).toFixed(2)}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleAddOrUpdateProducto}
                    disabled={!selectedProductId || !cantidad || parseInt(cantidad || '0') <= 0 || isUpdating}
                    className={`w-full text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 ${
                      editingIndex !== null
                        ? 'bg-green-700 hover:bg-green-600'
                        : 'bg-red-700 hover:bg-red-600'
                    }`}
                  >
                    {editingIndex !== null ? 'Actualizar Producto' : 'Agregar Producto'}
                  </button>
                </div>
              )}

              {/* Lista de productos */}
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {productos.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No hay productos en esta venta
                  </div>
                ) : (
                  productos.map((prod, index) => (
                    <div
                      key={`${prod.productId}-${index}`}
                      className={`flex items-center justify-between border rounded-lg p-3 text-sm ${
                        prod.isNew ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-800">{prod.nombre}</p>
                          {prod.isNew && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              Nuevo
                            </span>
                          )}
                        </div>
                        <div className="text-gray-600 text-xs">
                          <span>Cantidad: {prod.cantidad}</span>
                          <span className="mx-2">•</span>
                          <span>Precio: S/ {Number(prod.precio).toFixed(2)}</span>
                          <span className="mx-2">•</span>
                          <span className="font-bold text-black">Total: S/ {Number(prod.total).toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-2">
                        <button
                          type="button"
                          className="text-blue-600 hover:scale-105 p-1 disabled:opacity-50"
                          onClick={() => handleEditProducto(index)}
                          disabled={isUpdating}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          className="text-red-600 hover:scale-105 p-1 disabled:opacity-50"
                          onClick={() => handleDeleteProducto(index)}
                          disabled={isUpdating}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Resumen */}
              {productos.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg border">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">Total productos: {productos.length}</span>
                    <span className="text-gray-700">
                      Cantidad total: {productos.reduce((sum, p) => sum + Number(p.cantidad), 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold text-red-700 mt-2">
                    <span>Total de la venta:</span>
                    <span>S/ {totalVenta.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalEditSales;