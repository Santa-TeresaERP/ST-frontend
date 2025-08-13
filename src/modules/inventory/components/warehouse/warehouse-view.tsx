/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
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
import { useDeleteWarehouseProduct } from "@/modules/inventory/hook/useWarehouseProducts";
import ModalWarehouses from './warehouses/modal-warehouses';

// 🔥 IMPORTAR SISTEMA DE PERMISOS OPTIMIZADO
import { useModulePermissions } from '@/core/utils/permission-hooks';
import { MODULE_NAMES } from '@/core/utils/useModulesMap';

// Función para obtener las fechas de los últimos 3 días
const getInitialDateFilters = () => {
  const today = new Date();
  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(today.getDate() - 2);

  return {
    startDate: threeDaysAgo.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
  };
};

const WarehouseView: React.FC = () => {
  // Obtener las fechas iniciales
  const initialDates = getInitialDateFilters();

  const { data: warehouseProducts, isLoading, error  } = useFetchWarehouseProducts();
  const { data: warehouses } = useFetchWarehouses();
  const { data: products } = useFetchProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingProduct, setEditingProduct] = useState<React.Key | null>(null);
  const [showWarehouses, setShowWarehouses] = useState(false);

  // Estados para los filtros, inicializados con las fechas
  const [productFilter, setProductFilter] = useState("");
  const [startDate, setStartDate] = useState<string>(initialDates.startDate);
  const [endDate, setEndDate] = useState<string>(initialDates.endDate);

  const { mutate: toggleStatus } = useDeleteWarehouseProduct();

  // 🔥 USAR HOOK OPTIMIZADO DE PERMISOS - UNA SOLA LLAMADA
  const { canView, canCreate, canEdit, canDelete, isAdmin } = useModulePermissions(MODULE_NAMES.INVENTORY);

  const selectedWarehouseProduct = editingProduct
    ? warehouseProducts?.find((p: any) => p.id === editingProduct)
    : null;

  // **LISTA DE PRODUCTOS ÚNICOS PARA EL FILTRO**
  const productsList = useMemo(() => {
    if (!products) return [];
    const uniqueProductNames = new Set(products.map(p => p.name).filter(Boolean));
    return Array.from(uniqueProductNames);
  }, [products]);


  // Lógica de filtrado mejorada con useMemo
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
        ? productName === productFilter.toLowerCase()
        : true;

      // Filtro por rango de fechas
      let matchesDate = true;
      if (startDate || endDate) {
        const entryDate = product.entry_date ? new Date(product.entry_date) : null;
        if (entryDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          const entryDateNoTime = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());

          if (startDate && start.getTime() > entryDateNoTime.getTime()) matchesDate = false;
          if (endDate && end.getTime() < entryDateNoTime.getTime()) matchesDate = false;
        } else if (startDate || endDate) {
          matchesDate = false;
        }
      }

      return matchesSearchTerm && matchesProduct && matchesDate;
    });
  }, [warehouseProducts, searchTerm, productFilter, startDate, endDate, warehouses, products]);

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    setSearchTerm("");
    setProductFilter("");
    setStartDate(initialDates.startDate);
    setEndDate(initialDates.endDate);
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

      {/* 🔥 INDICADOR DE PERMISOS EN DESARROLLO */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Debug Permisos:</strong> 
            Módulo: {MODULE_NAMES.INVENTORY} | 
            Crear: {canCreate ? '✅' : '❌'} | 
            Editar: {canEdit ? '✅' : '❌'} | 
            Eliminar: {canDelete ? '✅' : '❌'} |
            Admin: {isAdmin ? '✅' : '❌'}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <div className="flex items-center space-x-2 text-gray-600">
          <Home size={24} className="text-blue-700" />
          <span className="text-lg font-medium">Lista de productos</span>
        </div>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full md:w-auto">
          {/* 🔥 BOTÓN DE ALMACENES - SOLO SI TIENE PERMISOS DE VER */}
          {(canView || isAdmin) && (
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-blue-700 text-white hover:bg-blue-800 transition-colors"
              onClick={() => setShowWarehouses(true)}
            >
              <Home size={18} /> Almacenes
            </button>
          )}
          
          {/* 🔥 BOTÓN DE CREAR PRODUCTO - SOLO SI TIENE PERMISOS DE CREAR */}
          {(canCreate || isAdmin) && (
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-blue-700 text-white hover:bg-blue-800"
            >
              <PlusCircle size={18} /> Crear Producto
            </button>
          )}
        </div>
      </div>


      {/* Sección de Filtros */}
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
            <input
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
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-10 bg-white text-gray-900 border border-gray-300 rounded-md w-full px-3"
            />
          </div>
        </div>

        {/* Filtros activos */}
        {(productFilter || (startDate !== initialDates.startDate) || (endDate !== initialDates.endDate)) && (
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
              <th className="px-4 py-2 text-center">Estado</th>
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
                  <td className="px-4 py-2 text-center">
                    {product.status ? (
                      <span className="text-green-600 font-semibold">Activo</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Inactivo</span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex justify-center gap-2">
                    {/* 🔥 BOTÓN DE EDITAR - SOLO SI TIENE PERMISOS DE EDITAR */}
                    {(canEdit || isAdmin) && (
                      <button onClick={() => setEditingProduct(product.id)} className="text-blue-600 hover:text-blue-800">
                        <Edit size={18} />
                      </button>
                    )}
                    
                    {/* 🔥 BOTÓN DE ELIMINAR/ACTIVAR - SOLO SI TIENE PERMISOS DE ELIMINAR */}
                    {(canDelete || isAdmin) && (
                      <button
                        onClick={() => toggleStatus(product.id)}
                        className={`hover:text-red-800 ${product.status ? 'text-red-600' : 'text-green-600'}`}
                        title={product.status ? "Desactivar" : "Activar"}
                      >
                        <Trash size={18} />
                      </button>
                    )}
                    
                    {/* 🔥 MENSAJE CUANDO NO HAY PERMISOS */}
                    {!canEdit && !canDelete && !isAdmin && (
                      <span className="text-gray-400 text-sm">Sin permisos</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  {searchTerm || (startDate !== initialDates.startDate) || (endDate !== initialDates.endDate) || productFilter ? "No se encontraron productos que coincidan con los filtros" : "No hay productos registrados"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔥 MODAL DE CREAR - SOLO SI TIENE PERMISOS */}
      {showCreate && (canCreate || isAdmin) && (
        <ModalCreateProductWarehouse
          onClose={() => setShowCreate(false)}
        />
      )}

      {/* 🔥 MODAL DE EDITAR - SOLO SI TIENE PERMISOS */}
      {editingProduct && selectedWarehouseProduct && (canEdit || isAdmin) && (
        <ModalEditProductWarehouse
          producto={selectedWarehouseProduct}
          onClose={() => setEditingProduct(null)}
        />
      )} 

      {/* 🔥 MODAL DE ALMACENES - SOLO SI TIENE PERMISOS DE VER */}
      {showWarehouses && (canView || isAdmin) && (
        <ModalWarehouses
          open={showWarehouses}
          onOpenChange={setShowWarehouses}
        />
      )}
    </div>
  );
};

export default WarehouseView;