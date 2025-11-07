/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import {
  Filter,
  PlusCircle,
  Edit,
  Trash,
  X,
  Calendar,
  RotateCcw,
} from "lucide-react";
import { useFetchBuysProducts, useDeleteBuysProduct, useReactivateBuysProduct } from "@/modules/inventory/hook/useBuysProducts";
import { useFetchWarehouses } from "@/modules/inventory/hook/useWarehouses";
import { useFetchProducts } from "@/modules/inventory/hook/useProducts";
import { useFetchSuppliers } from "@/modules/inventory/hook/useSuppliers";
import ModalCreateBuysProduct from './modal-create-buys-product';
import ModalEditBuysProduct from './modal-edit-buys-product';
import { formatDateLocal } from '@/core/utils/dateUtils';
import { useModulePermissions } from '@/core/utils/permission-hooks';
import { MODULE_NAMES } from '@/core/utils/useModulesMap';

const BuysProductView: React.FC = () => {
  const { data: buysProducts, isLoading, error } = useFetchBuysProducts();
  const { data: warehouses } = useFetchWarehouses();
  const { data: products } = useFetchProducts();
  const { data: suppliers } = useFetchSuppliers();

  const [searchTerm, setSearchTerm] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filtros
  const [warehouseFilter, setWarehouseFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const { mutate: deleteBuysProduct } = useDeleteBuysProduct();
  const { mutate: reactivateBuysProduct } = useReactivateBuysProduct();

  // 🔥 PERMISOS
  const { canView, canCreate, canEdit, canDelete, isAdmin } = 
    useModulePermissions(MODULE_NAMES.INVENTORY);

  // Compra seleccionada para editar
  const selectedBuysProduct = editingId
    ? buysProducts?.find((bp) => bp.id === editingId)
    : null;

  // Listas únicas para filtros
  const warehousesList = useMemo(() => {
    if (!warehouses) return [];
    return warehouses.filter(w => w.status);
  }, [warehouses]);

  const productsList = useMemo(() => {
    if (!products) return [];
    return products.filter(p => p.status);
  }, [products]);

  const suppliersList = useMemo(() => {
    if (!suppliers) return [];
    return suppliers.filter(s => s.status);
  }, [suppliers]);

  // Filtrado con useMemo
  const filteredBuysProducts = useMemo(() => {
    if (!buysProducts) return [];

    return buysProducts.filter((buysProduct) => {
      const warehouseName = warehouses?.find((w) => w.id === buysProduct.warehouse_id)?.name?.toLowerCase() || "";
      const productName = products?.find((p) => p.id === buysProduct.product_id)?.name?.toLowerCase() || "";
      const supplierName = suppliers?.find((s) => s.id === buysProduct.supplier_id)?.suplier_name?.toLowerCase() || "";
      const searchLower = searchTerm.toLowerCase();

      // Filtro por búsqueda general
      const matchesSearchTerm =
        warehouseName.includes(searchLower) ||
        productName.includes(searchLower) ||
        supplierName.includes(searchLower) ||
        buysProduct.quantity.toString().includes(searchLower) ||
        formatDateLocal(buysProduct.entry_date).toLowerCase().includes(searchLower);

      // Filtro por almacén
      const matchesWarehouse = warehouseFilter
        ? buysProduct.warehouse_id === warehouseFilter
        : true;

      // Filtro por producto
      const matchesProduct = productFilter
        ? buysProduct.product_id === productFilter
        : true;

      // Filtro por proveedor
      const matchesSupplier = supplierFilter
        ? buysProduct.supplier_id === supplierFilter
        : true;

      // Filtro por estado
      const matchesStatus = 
        statusFilter === "all" ? true :
        statusFilter === "active" ? buysProduct.status === true :
        buysProduct.status === false;

      // Filtro por rango de fechas
      let matchesDate = true;
      if (startDate || endDate) {
        const entryDate = buysProduct.entry_date ? new Date(buysProduct.entry_date) : null;
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

      return matchesSearchTerm && matchesWarehouse && matchesProduct && matchesSupplier && matchesStatus && matchesDate;
    });
  }, [buysProducts, searchTerm, warehouseFilter, productFilter, supplierFilter, statusFilter, startDate, endDate, warehouses, products, suppliers]);

  // Calcular totales
  const totals = useMemo(() => {
    if (!filteredBuysProducts) return { totalQuantity: 0, totalCost: 0 };
    
    return filteredBuysProducts.reduce((acc, bp) => ({
      totalQuantity: acc.totalQuantity + bp.quantity,
      totalCost: acc.totalCost + bp.total_cost
    }), { totalQuantity: 0, totalCost: 0 });
  }, [filteredBuysProducts]);

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setSearchTerm("");
    setWarehouseFilter("");
    setProductFilter("");
    setSupplierFilter("");
    setStartDate("");
    setEndDate("");
    setStatusFilter("all");
  };

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    if (currentStatus) {
      deleteBuysProduct(id);
    } else {
      reactivateBuysProduct(id);
    }
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
        Error al cargar las compras: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-blue-700">Compras de Productos</h2>
          <p className="text-gray-600 text-sm mt-1">Gestión de entradas de productos al almacén</p>
        </div>

        {/* 🔥 BOTÓN CREAR - SOLO CON PERMISOS */}
        {(canCreate || isAdmin) && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-blue-700 text-white hover:bg-blue-800 transition-colors"
          >
            <PlusCircle size={18} /> Nueva Compra
          </button>
        )}
      </div>

      {/* 🔥 DEBUG PERMISOS (solo development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
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

      {/* Sección de Filtros */}
      <div className="bg-white rounded-xl shadow p-4 border border-gray-200">
        <div className="flex flex-row md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="text-gray-600" size={20} />
            <h3 className="text-lg font-medium text-gray-800">Filtros</h3>
          </div>
          <button
            className="text-gray-600 hover:text-gray-800 self-start md:self-auto flex items-center px-2 py-1 rounded hover:bg-gray-100"
            onClick={clearAllFilters}
          >
            <X className="mr-1 h-4 w-4" /> Limpiar Filtros
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda general */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar..."
              className="h-10 bg-white text-gray-900 border border-gray-300 rounded-md w-full px-3"
            />
          </div>

          {/* Filtro de Almacén */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Almacén
            </label>
            <select
              value={warehouseFilter}
              onChange={(e) => setWarehouseFilter(e.target.value)}
              className="h-10 bg-white text-gray-900 border border-gray-300 rounded-md w-full px-3"
            >
              <option value="">Todos los almacenes</option>
              {warehousesList.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>

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
              {productsList.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro de Proveedor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Proveedor
            </label>
            <select
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
              className="h-10 bg-white text-gray-900 border border-gray-300 rounded-md w-full px-3"
            >
              <option value="">Todos los proveedores</option>
              {suppliersList.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.suplier_name}
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

          {/* Filtro de Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
              className="h-10 bg-white text-gray-900 border border-gray-300 rounded-md w-full px-3"
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </div>

        {/* Filtros activos */}
        {(warehouseFilter || productFilter || supplierFilter || startDate || endDate || statusFilter !== "all") && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Filtros activos:</span>
              {warehouseFilter && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Almacén: {warehousesList.find(w => w.id === warehouseFilter)?.name}
                </span>
              )}
              {productFilter && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Producto: {productsList.find(p => p.id === productFilter)?.name}
                </span>
              )}
              {supplierFilter && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Proveedor: {suppliersList.find(s => s.id === supplierFilter)?.suplier_name}
                </span>
              )}
              {startDate && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Desde: {formatDateLocal(startDate)}
                </span>
              )}
              {endDate && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Hasta: {formatDateLocal(endDate)}
                </span>
              )}
              {statusFilter !== "all" && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Estado: {statusFilter === "active" ? "Activos" : "Inactivos"}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Resumen de Totales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Total Productos</p>
          <p className="text-2xl font-bold text-gray-900">{totals.totalQuantity.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Costo Total</p>
          <p className="text-2xl font-bold text-gray-900">S/. {totals.totalCost.toFixed(2)}</p>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 text-center">Fecha</th>
              <th className="px-4 py-2 text-center">Almacén</th>
              <th className="px-4 py-2 text-center">Producto</th>
              <th className="px-4 py-2 text-center">Proveedor</th>
              <th className="px-4 py-2 text-right">Cantidad</th>
              <th className="px-4 py-2 text-right">Precio Unit.</th>
              <th className="px-4 py-2 text-right">Costo Total</th>
              <th className="px-4 py-2 text-center">Estado</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredBuysProducts && filteredBuysProducts.length > 0 ? (
              filteredBuysProducts.map((buysProduct) => (
                <tr key={buysProduct.id} className="hover:bg-gray-50 border-t">
                  <td className="px-4 py-2 text-center">
                    {formatDateLocal(buysProduct.entry_date)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {warehouses?.find((w) => w.id === buysProduct.warehouse_id)?.name || "Desconocido"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {products?.find((p) => p.id === buysProduct.product_id)?.name || "Desconocido"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {suppliers?.find((s) => s.id === buysProduct.supplier_id)?.suplier_name || "Desconocido"}
                  </td>
                  <td className="px-4 py-2 text-right font-medium">
                    {buysProduct.quantity.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right">
                    S/. {buysProduct.unit_price.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right font-bold text-green-700">
                    S/. {buysProduct.total_cost.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {buysProduct.status ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex justify-center gap-2">
                    {/* 🔥 BOTÓN DE EDITAR - SOLO SI TIENE PERMISOS */}
                    {(canEdit || isAdmin) && (
                      <button
                        onClick={() => setEditingId(buysProduct.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                    )}
                    
                    {/* 🔥 BOTÓN DE ELIMINAR/REACTIVAR - SOLO SI TIENE PERMISOS */}
                    {(canDelete || isAdmin) && (
                      <button
                        onClick={() => handleToggleStatus(buysProduct.id, buysProduct.status)}
                        className={`hover:opacity-80 ${buysProduct.status ? 'text-red-600' : 'text-green-600'}`}
                        title={buysProduct.status ? "Desactivar" : "Reactivar"}
                      >
                        {buysProduct.status ? <Trash size={18} /> : <RotateCcw size={18} />}
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
                <td colSpan={9} className="text-center py-4 text-gray-500">
                  {searchTerm || warehouseFilter || productFilter || supplierFilter || startDate || endDate || statusFilter !== "all"
                    ? "No se encontraron compras que coincidan con los filtros"
                    : "No hay compras registradas"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔥 MODAL DE CREAR - SOLO SI TIENE PERMISOS */}
      {showCreate && (canCreate || isAdmin) && (
        <ModalCreateBuysProduct onClose={() => setShowCreate(false)} />
      )}

      {/* 🔥 MODAL DE EDITAR - SOLO SI TIENE PERMISOS */}
      {editingId && selectedBuysProduct && (canEdit || isAdmin) && (
        <ModalEditBuysProduct
          buysProduct={selectedBuysProduct}
          onClose={() => setEditingId(null)}
        />
      )}
    </div>
  );
};

export default BuysProductView;
