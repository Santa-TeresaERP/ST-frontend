/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react"; // Importar useMemo
import {
  Filter,
  Home,
  Edit,
  Trash,
  PlusCircle,
  X, // Importar X para el botón de limpiar filtros
  Calendar, // Importar Calendar para los iconos de fecha
} from "lucide-react";
import { useFetchWarehouseProducts } from "@/modules/inventory/hook/useWarehouseProducts";
import { useFetchWarehouses } from "@/modules/inventory/hook/useWarehouses";
import { useFetchProducts } from "@/modules/inventory/hook/useProducts";
import ModalCreateProductWarehouse from './product/modal-create-product-warehouse'; 
import ModalEditProductWarehouse from './product/modal-edit-product-warehouse';
import ModalDeleteProductWarehouse from './product/modal-delete-product-warehouse';
import ModalWarehouses from './warehouses/modal-warehouses';

import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';

const WarehouseView: React.FC = () => {
  const { data: warehouseProducts, isLoading, error } = useFetchWarehouseProducts();
  const { data: warehouses } = useFetchWarehouses();
  const { data: products } = useFetchProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingProduct, setEditingProduct] = useState<React.Key | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<React.Key | null>(null);
  const [showWarehouses, setShowWarehouses] = useState(false);

  // **NUEVOS ESTADOS PARA LOS FILTROS**
  const [productFilter, setProductFilter] = useState(""); // Filtro por nombre de producto
  const [startDate, setStartDate] = useState<string>(""); // Filtro "Fecha desde"
  const [endDate, setEndDate] = useState<string>("");     // Filtro "Fecha hasta"

  const selectedWarehouseProduct = editingProduct
    ? warehouseProducts?.find((p: any) => p.id === editingProduct)
    : null;

  const deletingWarehouseProduct = deletingProduct
    ? warehouseProducts?.find((p: any) => p.id === deletingProduct)
    : null;

  // **LISTA DE PRODUCTOS ÚNICOS PARA EL FILTRO**
  const productsList = useMemo(() => {
    if (!products) return [];
    const uniqueProductNames = new Set(products.map(p => p.name).filter(Boolean));
    return Array.from(uniqueProductNames);
  }, [products]);


  // **LÓGICA DE FILTRADO MEJORADA CON useMemo**
  const filteredProducts = useMemo(() => {
    if (!warehouseProducts) return [];

    return warehouseProducts.filter((product: any) => {
      const searchLower = searchTerm.toLowerCase();
      const warehouseName = warehouses?.find((w) => w.id === product.warehouse_id)?.name?.toLowerCase() || "";
      const productName = products?.find((p) => p.id === product.product_id)?.name?.toLowerCase() || "";

      // Filtro por término de búsqueda general
      const matchesSearchTerm =
        warehouseName.includes(searchLower) ||
        productName.includes(searchLower) ||
        product.quantity.toString().includes(searchLower) ||
        new Date(product.entry_date).toLocaleDateString().toLowerCase().includes(searchLower);

      // Filtro por producto (dropdown)
      const matchesProduct = productFilter
        ? productName === productFilter.toLowerCase() // Asegúrate de comparar en minúsculas si productFilter viene de lowercase
        : true;

      // Filtro por rango de fechas
      let matchesDate = true;
      if (startDate || endDate) {
        const entryDate = product.entry_date ? new Date(product.entry_date) : null;
        if (entryDate) {
          if (startDate && new Date(startDate) > entryDate) matchesDate = false;
          if (endDate && new Date(endDate) < entryDate) matchesDate = false;
        } else if (startDate || endDate) {
          matchesDate = false; // Si no hay fecha de entrada pero hay filtro de fecha, no coincide
        }
      }

      return matchesSearchTerm && matchesProduct && matchesDate;
    });
  }, [warehouseProducts, searchTerm, productFilter, startDate, endDate, warehouses, products]); // Dependencias de useMemo


  // **FUNCIÓN PARA LIMPIAR TODOS LOS FILTROS**
  const clearAllFilters = () => {
    setSearchTerm("");
    setProductFilter("");
    setStartDate("");
    setEndDate("");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-500 rounded-lg">
        Error al cargar los productos: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-semibold text-blue-700">Gestión de Almacén</h2>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <div className="flex items-center space-x-2 text-gray-600">
          <Home size={24} className="text-blue-700" />
          <span className="text-lg font-medium">Lista de productos</span>
        </div>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full md:w-auto">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-blue-700 text-white hover:bg-blue-800 transition-colors"
            onClick={() => setShowWarehouses(true)}
          >
            <Home size={18} /> Almacenes
          </button>
          <div className="relative inline-flex items-center shadow-sm rounded-xl bg-white">
            {/* El icono de Filter ya no es para la búsqueda general, lo dejaremos en el input de búsqueda como estaba */}
            {/* Puedes reemplazarlo con Search si es más apropiado aquí */}
            <Filter className="absolute left-4 text-blue-700 pointer-events-none" size={20} />
            <input
              type="text"
              className="w-full md:w-auto pl-11 pr-6 py-3 rounded-xl border border-blue-700 text-gray-700 text-base focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent hover:bg-gray-200 transition duration-300 min-w-[200px]"
              placeholder="Buscar por producto, almacén, cantidad o fecha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-blue-700 text-white hover:bg-blue-800"
          >
            <PlusCircle size={18} /> Crear Producto
          </button>
        </div>
      </div>

      {/* **SECCIÓN DE FILTROS** */}
      <div className="bg-white rounded-xl shadow p-4 border border-gray-200">
        <div className="flex flex-row md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="text-gray-600" size={20} />
            <h3 className="text-lg font-medium text-gray-800">Filtros</h3>
          </div>
          <button
            // Usamos un botón normal si no tienes el componente Button de shadcn/ui
            // Si lo tienes, puedes usar <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            className="text-gray-600 hover:text-gray-800 self-start md:self-auto flex items-center px-2 py-1 rounded hover:bg-gray-100"
            onClick={clearAllFilters}
          >
            <X className="mr-1 h-4 w-4" /> Limpiar Filtros
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtro de Producto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Producto
            </label>
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="h-10 bg-white text-gray-900 border border-gray-300 rounded-md w-full px-3"
            >
              <option value="">Todos los productos</option>
              {productsList.map((productName, index) => (
                <option key={index} value={productName}>
                  {productName}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha desde */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              <Calendar className="inline mr-1 h-4 w-4" />
              Fecha desde
            </label>
            <input // Usamos input HTML si no tienes un componente Input específico
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-10 bg-white text-gray-900 border border-gray-300 rounded-md w-full px-3"
            />
          </div>

          {/* Fecha hasta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              <Calendar className="inline mr-1 h-4 w-4" />
              Fecha hasta
            </label>
            <input // Usamos input HTML si no tienes un componente Input específico
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-10 bg-white text-gray-900 border border-gray-300 rounded-md w-full px-3"
            />
          </div>
        </div>

        {/* Filtros activos */}
        {(productFilter || startDate || endDate) && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Filtros activos:</span>
              {productFilter && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Producto: {productFilter}
                </span>
              )}
              {startDate && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Desde: {new Date(startDate).toLocaleDateString()}
                </span>
              )}
              {endDate && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Hasta: {new Date(endDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        )}
      </div>


      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 text-center">Almacén</th>
              <th className="px-4 py-2 text-center">Producto</th>
              <th className="px-4 py-2 text-center">Cantidad</th>
              <th className="px-4 py-2 text-center">Fecha de Entrada</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts && filteredProducts.length > 0 ? (
              filteredProducts.map((product: any) => (
                <tr key={product.id} className="hover:bg-gray-50 border-t">
                  <td className="px-4 py-2 text-center">
                    {warehouses?.find((w) => w.id === product.warehouse_id)?.name || "Desconocido"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {products?.find((p) => p.id === product.product_id)?.name || "Desconocido"}
                  </td>
                  <td className="px-4 py-2 text-center">{product.quantity}</td>
                  <td className="px-4 py-2 text-center">{new Date(product.entry_date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 flex justify-center gap-2">
                    <button onClick={() => setEditingProduct(product.id)} className="text-blue-600 hover:text-blue-800">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => setDeletingProduct(product.id)} className="text-red-600 hover:text-red-800">
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  {searchTerm || productFilter || startDate || endDate ? "No se encontraron productos que coincidan con los filtros" : "No hay productos registrados"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <ModalCreateProductWarehouse
          onClose={() => setShowCreate(false)}
        />
      )}

      {editingProduct && selectedWarehouseProduct && (
        <ModalEditProductWarehouse
          producto={selectedWarehouseProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}

      {deletingProduct && deletingWarehouseProduct && (
        <ModalDeleteProductWarehouse
          isOpen={!!deletingProduct}
          onClose={() => setDeletingProduct(null)}
          warehouseProductId={deletingProduct as string}
          productName={
            products?.find((p) => p.id === deletingWarehouseProduct.product_id)?.name
          }
        />
      )}

      {showWarehouses && (
        <ModalWarehouses
          open={showWarehouses}
          onOpenChange={setShowWarehouses}
        />
      )}
    </div>
  );
};

export default WarehouseView;