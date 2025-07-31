/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { X, Save, Pencil, Trash2 } from "lucide-react";
import { FiShoppingCart, FiPackage } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSaleSchema } from "../../schemas/saleValidation";
import { CreateSalePayload } from "../../types/sales";
import { useCreateSale } from "../../hooks/useSales";
import { useCreateSalesDetail } from "../../hooks/useSalesDetails";
import { useFetchProducts } from "@/modules/production/hook/useProducts";
import { useFetchStores } from "@/modules/sales/hooks/useStore"; // Importar el hook para obtener las tiendas
import { Product as ProductType } from "@/modules/production/types/products";
import { useStoreState } from "@/core/store/store";
import { useFetchWarehouseStoreItems } from "@/modules/sales/hooks/useInventoryQueries";

interface CartProduct {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  total: number;
}

interface ModalCreateSalesProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalCreateSales: React.FC<ModalCreateSalesProps> = ({
  isOpen,
  onClose,
}) => {
  const createSale = useCreateSale();
  const createSalesDetail = useCreateSalesDetail();
  const { data: allProducts = [], isLoading: loadingProducts } =
    useFetchProducts();
  const { data: storesData, isLoading: loadingStores } = useFetchStores(); // Obtener las tiendas
  const stores = storesData?.stores || [];
  const { selectedStore } = useStoreState();
  const { data: warehouseStoreItems = [] } = useFetchWarehouseStoreItems();
  const [selectedProductId, setSelectedProductId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [productos, setProductos] = useState<CartProduct[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateSalePayload>({
    resolver: zodResolver(createSaleSchema),
    defaultValues: {
      income_date: "",
      store_id: selectedStore?.id || "",
      total_income: 0,
      observations: "",
    },
  });

  // Sincronizar el store_id cuando cambia la tienda seleccionada o se abre el modal
  useEffect(() => {
    if (isOpen && selectedStore?.id) {
      setValue("store_id", selectedStore.id);
    }
  }, [selectedStore, isOpen, setValue]);

  useEffect(() => {
    const nuevoTotal = productos.reduce((sum, prod) => sum + prod.total, 0);
    setValue("total_income", nuevoTotal);
  }, [productos, setValue]);

  const selectedProduct = allProducts.find((p) => p.id === selectedProductId);

  const getProductPrice = (product: ProductType): number => {
    const price =
      typeof product.price === "string"
        ? parseFloat(product.price)
        : product.price;
    return isNaN(price) ? 0 : price;
  };

  const totalProductoActual =
    selectedProduct && cantidad
      ? getProductPrice(selectedProduct) * parseInt(cantidad || "0")
      : 0;

  const handleAddOrUpdateProducto = () => {
    if (!selectedProductId || !cantidad || !selectedProduct) return;

    const cantidadNum = parseInt(cantidad);
    if (cantidadNum <= 0) return;

    const precio = getProductPrice(selectedProduct);

    const nuevoProducto: CartProduct = {
      id: selectedProduct.id,
      nombre: selectedProduct.name || "Producto sin nombre",
      precio: precio,
      cantidad: cantidadNum,
      total: precio * cantidadNum,
    };

    let nuevosProductos: CartProduct[];
    if (editingIndex !== null) {
      nuevosProductos = [...productos];
      nuevosProductos[editingIndex] = nuevoProducto;
      setEditingIndex(null);
    } else {
      const existingIndex = productos.findIndex(
        (p) => p.id === selectedProductId
      );
      if (existingIndex !== -1) {
        nuevosProductos = [...productos];
        nuevosProductos[existingIndex] = {
          ...nuevosProductos[existingIndex],
          cantidad: nuevosProductos[existingIndex].cantidad + cantidadNum,
          total:
            (nuevosProductos[existingIndex].cantidad + cantidadNum) * precio,
        };
      } else {
        nuevosProductos = [...productos, nuevoProducto];
      }
    }

    setProductos(nuevosProductos);
    setSelectedProductId("");
    setCantidad("");
  };

  const handleEditProducto = (index: number) => {
    const prod = productos[index];
    setSelectedProductId(prod.id);
    setCantidad(prod.cantidad.toString());
    setEditingIndex(index);
  };

  const handleDeleteProducto = (index: number) => {
    const nuevosProductos = productos.filter((_, idx) => idx !== index);
    setProductos(nuevosProductos);
  };

  const onSubmit = async (data: CreateSalePayload) => {
    if (productos.length === 0) {
      alert("Debe agregar al menos un producto");
      return;
    }

    setIsCreating(true);
    try {
      const createdSale = await createSale.mutateAsync(data);
      if (!createdSale?.id) {
        throw new Error("La venta se creó pero no tiene ID");
      }

      for (let i = 0; i < productos.length; i++) {
        const producto = productos[i];
        const detailData = {
          saleId: String(createdSale.id),
          productId: String(producto.id),
          quantity: Number(producto.cantidad),
          mount: Number(producto.total),
        };

        await createSalesDetail.mutateAsync(detailData);
      }

      reset();
      setProductos([]);
      setSelectedProductId("");
      setCantidad("");
      setEditingIndex(null);
      onClose();
    } catch (error) {
      console.error("Error al crear la venta:", error);
      alert("Error al crear la venta");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      reset();
      setProductos([]);
      setSelectedProductId("");
      setCantidad("");
      setEditingIndex(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative mx-2 animate-fadeIn">
        <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-4 rounded-t-2xl flex items-center justify-center relative gap-2">
          <FiShoppingCart size={24} />
          <h2 className="text-lg font-semibold text-center">
            Registrar Nueva Venta
          </h2>
          <button
            onClick={handleClose}
            disabled={isCreating}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col lg:flex-row gap-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:w-1/2 space-y-4 text-left"
          >
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tienda <span className="text-red-600">*</span>
              </label>
              {selectedStore ? (
                <input
                  type="text"
                  value={selectedStore.store_name}
                  disabled
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              ) : (
                <select
                  {...register("store_id")}
                  disabled={loadingStores || isCreating}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none shadow-sm disabled:bg-gray-100"
                >
                  <option value="">
                    {loadingStores
                      ? "Cargando tiendas..."
                      : "Seleccionar tienda"}
                  </option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.store_name}
                    </option>
                  ))}
                </select>
              )}
              {/* Campo oculto para enviar el ID de la tienda */}
              <input
                type="hidden"
                {...register("store_id")}
                value={selectedStore?.id || ""}
              />
              {errors.store_id && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.store_id.message}
                </p>
              )}
              {!selectedStore && (
                <p className="text-amber-600 text-xs mt-1">
                  💡 Selecciona una tienda desde la vista principal para
                  facilitar el llenado
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Total de Ingresos <span className="text-red-100">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                {...register("total_income", { valueAsNumber: true })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none shadow-sm bg-gray-300"
                placeholder="0.00"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">
                Se calcula automáticamente según los productos agregados
              </p>
              {errors.total_income && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.total_income.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Fecha de Venta <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                {...register("income_date")}
                disabled={isCreating}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none shadow-sm disabled:bg-gray-100"
              />
              {errors.income_date && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.income_date.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Observaciones
              </label>
              <textarea
                {...register("observations")}
                disabled={isCreating}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none shadow-sm disabled:bg-gray-100"
                rows={3}
                placeholder="Observaciones adicionales..."
              />
              {errors.observations && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.observations.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm"
                disabled={isCreating}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isCreating || productos.length === 0}
                className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-600 text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creando venta...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Guardar Venta
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="w-px bg-gray-300 hidden lg:block"></div>

          <div className="lg:w-1/2">
            <h3 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FiPackage size={18} /> Productos de la venta
            </h3>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs text-gray-700 mb-1">
                  Producto *
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  disabled={loadingProducts || isCreating}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none disabled:bg-gray-100"
                >
                  <option value="">
                    {loadingProducts
                      ? "Cargando productos..."
                      : "Seleccionar producto"}
                  </option>
                  {warehouseStoreItems
                    .filter((item) => item.storeId === selectedStore?.id)
                    .map((item) => {
                      const product = allProducts.find(
                        (p) => p.id === item.productId
                      );
                      return (
                        <option key={item.productId} value={item.productId}>
                          {product?.name || "Sin nombre"} - S/{" "}
                          {getProductPrice(
                            product || ({ id: "", name: "", price: 0 } as any)
                          ).toFixed(2)}
                        </option>
                      );
                    })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">
                    Cantidad *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    disabled={isCreating}
                    placeholder="1"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">
                    Total S/
                  </label>
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
                  <strong>{selectedProduct.name || "Sin nombre"}</strong> -
                  Precio unitario: S/{" "}
                  {getProductPrice(selectedProduct).toFixed(2)}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleAddOrUpdateProducto}
              disabled={
                !selectedProductId ||
                !cantidad ||
                parseInt(cantidad || "0") <= 0 ||
                isCreating
              }
              className={`mb-4 text-white px-4 py-2 rounded-lg text-sm w-full disabled:opacity-50 disabled:cursor-not-allowed ${
                editingIndex !== null
                  ? "bg-green-700 hover:bg-green-600"
                  : "bg-red-700 hover:bg-red-600"
              }`}
            >
              {editingIndex !== null
                ? "Actualizar Producto"
                : "Agregar Producto"}
            </button>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {productos.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No hay productos agregados
                </div>
              ) : (
                productos.map((prod, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border border-gray-200 rounded-lg p-3 bg-gray-50 text-sm"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{prod.nombre}</p>
                      <div className="text-gray-600 text-xs">
                        <span>Cantidad: {prod.cantidad}</span>
                        <span className="mx-2">•</span>
                        <span>Precio: S/ {prod.precio.toFixed(2)}</span>
                        <span className="mx-2">•</span>
                        <span className="font-bold text-black">
                          Total: S/ {prod.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <button
                        type="button"
                        className="text-blue-600 hover:scale-105 p-1 disabled:opacity-50"
                        onClick={() => handleEditProducto(index)}
                        disabled={isCreating}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        className="text-red-600 hover:scale-105 p-1 disabled:opacity-50"
                        onClick={() => handleDeleteProducto(index)}
                        disabled={isCreating}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {productos.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg border">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">
                    Total productos: {productos.length}
                  </span>
                  <span className="text-gray-700">
                    Cantidad total:{" "}
                    {productos.reduce((sum, p) => sum + p.cantidad, 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-red-700 mt-2">
                  <span>Total de la venta:</span>
                  <span>
                    S/{" "}
                    {productos.reduce((sum, p) => sum + p.total, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateSales;
