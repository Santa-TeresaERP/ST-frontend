/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Filter,
  Home,
  Edit,
  Trash,
  PlusCircle,
} from "lucide-react";
import { useFetchWarehouseProducts } from "@/modules/inventory/hook/useWarehouseProducts";
import { useFetchWarehouses } from "@/modules/inventory/hook/useWarehouses";
import { useFetchProducts } from "@/modules/inventory/hook/useProducts";
import ModalCreateProductWarehouse from './product/modal-create-product-warehouse'; 
import ModalEditProductWarehouse from './product/modal-edit-product-warehouse';
import ModalDeleteProductWarehouse from './product/modal-delete-product-warehouse';
import ModalWarehouses from './warehouses/modal-warehouses';

const WarehouseView: React.FC = () => {
  const { data: warehouseProducts, isLoading, error } = useFetchWarehouseProducts();
  const { data: warehouses } = useFetchWarehouses();
  const { data: products } = useFetchProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingProduct, setEditingProduct] = useState<React.Key | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<React.Key | null>(null);
  const [showWarehouses, setShowWarehouses] = useState(false);

  const selectedWarehouseProduct = editingProduct
    ? warehouseProducts?.find((p: any) => p.id === editingProduct)
    : null;

  const deletingWarehouseProduct = deletingProduct
    ? warehouseProducts?.find((p: any) => p.id === deletingProduct)
    : null;

  const filteredProducts = warehouseProducts?.filter((product: any) => {
    const searchLower = searchTerm.toLowerCase();
    const warehouseName = warehouses?.find((w) => w.id === product.warehouse_id)?.name?.toLowerCase() || "";
    const productName = products?.find((p) => p.id === product.product_id)?.name?.toLowerCase() || "";
    return (
      warehouseName.includes(searchLower) ||
      productName.includes(searchLower) ||
      product.quantity.toString().includes(searchLower) ||
      new Date(product.entry_date).toLocaleDateString().toLowerCase().includes(searchLower)
    );
  });

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
                  {searchTerm ? "No se encontraron productos que coincidan con la búsqueda" : "No hay productos registrados"}
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
