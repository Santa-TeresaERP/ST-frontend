/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Filter,
  Home,
  Package,
  Users,
  Edit,
  Trash,
  PlusCircle,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  useFetchWarehouseResources,
  useCreateWarehouseResource,
  useUpdateWarehouseResource,
  useDeleteWarehouseResource,
} from "@/modules/inventory/hook/useWarehouseResources";
import { useFetchResources } from "@/modules/inventory/hook/useResources";
import { useFetchWarehouses } from "@/modules/inventory/hook/useWarehouses";
import { useFetchWarehouseProducts } from "@/modules/inventory/hook/useWarehouseProducts";
import ModalCreateWarehouses from "./resource/modal-create-resource-warehouse";
import ModalEditWarehouses from "./resource/modal-edit-resource-warehouse";
import ModalDeleteWarehouses from "./resource/modal-delete-resource-warehouse";
import { useFetchProducts } from "@/modules/inventory/hook/useProducts";
import ModalCreateProductWarehouse from './product/modal-create-product-warehouse'; 
import ModalEditProductWarehouse from './product/modal-edit-product-warehouse';
import ModalDeleteProductWarehouse from './product/modal-delete-product-warehouse';
import ModalWarehouses from './warehouses/modal-warehouses';

const WarehouseView: React.FC = () => {
  const {
    data: warehouseResources,
    isLoading,
    error,
  } = useFetchWarehouseResources();
  const { data: resources } = useFetchResources();
  const { data: warehouses } = useFetchWarehouses();
  const { data: warehouseProducts } = useFetchWarehouseProducts();
  const { data: products } = useFetchProducts();

  const createResource = useCreateWarehouseResource();
  const updateResource = useUpdateWarehouseResource();
  const deleteResource = useDeleteWarehouseResource();

  const [searchTerm, setSearchTerm] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingResource, setEditingResource] = useState<string | null>(null);
  const [deletingResource, setDeletingResource] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<React.Key | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<React.Key | null>(null);
  const [selectedType, setSelectedType] = useState<"producto" | "recurso">("producto");
  const [showWarehouses, setShowWarehouses] = useState(false);
  
  // Filtros adicionales
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const enrichedResources = warehouseResources?.map((warehouseResource) => {
    const resource = resources?.find(
      (r) => r.id === warehouseResource.resource_id
    );
    const warehouse = warehouses?.find(
      (w) => w.id === warehouseResource.warehouse_id
    );
    return {
      ...warehouseResource,
      resource_name: resource?.name || "Desconocido",
      warehouse_name: warehouse?.name || "Desconocido",
    };
  });

  const selectedWarehouseProduct = editingProduct
    ? warehouseProducts?.find((p: any) => p.id === editingProduct)
    : null;
  const deletingWarehouseProduct = deletingProduct
    ? warehouseProducts?.find((p: any) => p.id === deletingProduct)
    : null;

  const filteredResources = enrichedResources?.filter((resource) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      resource.warehouse_name.toLowerCase().includes(searchLower) ||
      resource.resource_name.toLowerCase().includes(searchLower) ||
      resource.quantity.toString().includes(searchLower) ||
      new Date(resource.entry_date)
        .toLocaleDateString()
        .toLowerCase()
        .includes(searchLower);
    
    const matchesWarehouse = !selectedWarehouse || resource.warehouse_id === selectedWarehouse;
    const matchesItem = !selectedItem || resource.resource_id === selectedItem;
    const matchesDate = 
      (!startDate || new Date(resource.entry_date) >= startDate) &&
      (!endDate || new Date(resource.entry_date) <= endDate);

    return matchesSearch && matchesWarehouse && matchesItem && matchesDate;
  });

  const filteredProducts = warehouseProducts?.filter((product: any) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      product.product_id.toLowerCase().includes(searchLower) ||
      warehouses?.find((w) => w.id === product.warehouse_id)?.name
        .toLowerCase()
        .includes(searchLower);

    const matchesWarehouse = !selectedWarehouse || product.warehouse_id === selectedWarehouse;
    const matchesProduct = !selectedItem || product.product_id === selectedItem;
    const matchesDate =
      (!startDate || new Date(product.entry_date) >= startDate) &&
      (!endDate || new Date(product.entry_date) <= endDate);

    return matchesSearch && matchesWarehouse && matchesProduct && matchesDate;
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
        Error al cargar los recursos: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-blue-700">Gestión de Almacén</h2>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 text-gray-600">
          <Home size={24} className="text-blue-700" />
          <span className="text-lg font-medium">
            Lista de {selectedType === 'producto' ? 'productos' : 'recursos'}
          </span>
        </div>
        <div className="flex items-center gap-2">
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
              className="pl-11 pr-6 py-3 rounded-xl border border-blue-700 text-gray-700 text-base focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent hover:bg-gray-200 transition duration-300 min-w-[200px]"
              placeholder={`Buscar por ${selectedType === 'producto' ? 'producto' : 'recurso'}, almacén, cantidad o fecha...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-blue-700 text-white hover:bg-blue-800"
          >
            <PlusCircle size={18} /> Crear {selectedType === 'producto' ? 'Producto' : 'Recurso'}
          </button>
        </div>
      </div>

      {/* Botones Producto y Recurso */}
      <div className="flex gap-2 mb-4 mt-2">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${
            selectedType === 'producto'
              ? 'bg-blue-700 text-white'
              : 'bg-white text-blue-700 border border-blue-700'
          }`}
          onClick={() => {
            setSelectedType('producto');
            setSelectedItem(null);
          }}
        >
          <Package size={18} /> Producto
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${
            selectedType === 'recurso'
              ? 'bg-orange-500 text-white'
              : 'bg-white text-orange-500 border border-orange-500'
          }`}
          onClick={() => {
            setSelectedType('recurso');
            setSelectedItem(null);
          }}
        >
          <Users size={18} /> Recurso
        </button>
      </div>

      {/* Filtros adicionales */}
      <div className="flex flex-wrap gap-4 items-center">
        <select
          className="px-4 py-2 rounded-xl border border-blue-700 text-gray-700 bg-white"
          value={selectedWarehouse || ""}
          onChange={(e) => setSelectedWarehouse(e.target.value || null)}
        >
          <option value="">Todos los almacenes</option>
          {warehouses?.map((warehouse) => (
            <option key={warehouse.id} value={warehouse.id}>
              {warehouse.name}
            </option>
          ))}
        </select>

        {selectedType === 'producto' ? (
          <select
            className="px-4 py-2 rounded-xl border border-blue-700 text-gray-700 bg-white"
            value={selectedItem || ""}
            onChange={(e) => setSelectedItem(e.target.value || null)}
          >
            <option value="">Todos los productos</option>
            {products?.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        ) : (
          <select
            className="px-4 py-2 rounded-xl border border-blue-700 text-gray-700 bg-white"
            value={selectedItem || ""}
            onChange={(e) => setSelectedItem(e.target.value || null)}
          >
            <option value="">Todos los recursos</option>
            {resources?.map((resource) => (
              <option key={resource.id} value={resource.id}>
                {resource.name}
              </option>
            ))}
          </select>
        )}

        <div className="flex items-center gap-2">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Fecha inicio"
            className="px-4 py-2 rounded-xl border border-blue-700 text-gray-700 bg-white"
          />
          <span>a</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate || undefined}
            placeholderText="Fecha fin"
            className="px-4 py-2 rounded-xl border border-blue-700 text-gray-700 bg-white"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        {selectedType === "producto" ? (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-800 dark:bg-gray-700 text-white">
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
                    <td className="px-4 py-2">
                      {warehouses?.find((w) => w.id === product.warehouse_id)
                        ?.name || "Desconocido"}
                    </td>
                    <td className="px-4 py-2">
                      {products?.find((p) => p.id === product.product_id)?.name ||
                        "Desconocido"}
                    </td>
                    <td className="px-4 py-2">{product.quantity}</td>
                    <td className="px-4 py-2">
                      {new Date(product.entry_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 flex space-x-2">
                      <button
                        onClick={() => setEditingProduct(product.id!)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => setDeletingProduct(product.id!)}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar"
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    {searchTerm || selectedWarehouse || selectedItem || startDate || endDate
                      ? "No se encontraron productos que coincidan con los filtros"
                      : "No hay productos registrados"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-800 dark:bg-gray-700bg-gray-800 dark:bg-gray-700 text-white">
              <tr>
                <th className="px-4 py-2 text-center">Almacén</th>
                <th className="px-4 py-2 text-center">Recurso</th>
                <th className="px-4 py-2 text-center">Cantidad</th>
                <th className="px-4 py-2 text-center">Fecha de Entrada</th>
                <th className="px-4 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources && filteredResources.length > 0 ? (
                filteredResources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-gray-50 border-t">
                    <td className="px-4 py-2">{resource.warehouse_name}</td>
                    <td className="px-4 py-2">{resource.resource_name}</td>
                    <td className="px-4 py-2">{resource.quantity}</td>
                    <td className="px-4 py-2">
                      {new Date(resource.entry_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 flex space-x-2">
                      <button
                        onClick={() => setEditingResource(resource.id!)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => setDeletingResource(resource.id!)}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar"
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    {searchTerm || selectedWarehouse || selectedItem || startDate || endDate
                      ? "No se encontraron recursos que coincidan con los filtros"
                      : "No hay recursos registrados"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showCreate && (
        selectedType === 'producto' ? (
          <ModalCreateProductWarehouse
            onClose={() => setShowCreate(false)}
            // Add appropriate props for product creation here
          />
        ) : (
          <ModalCreateWarehouses
            open={showCreate}
            onClose={() => setShowCreate(false)}
            onCreate={async (newResource) => {
              return new Promise<void>((resolve, reject) => {
                createResource.mutate(newResource, {
                  onSuccess: () => {
                    setShowCreate(false);
                    resolve();
                  },
                  onError: (error) => {
                    console.error("Error al crear recurso:", error);
                    reject(error);
                  },
                });
              });
            }}
            onSuccess={() => {}}
            resourceType={selectedType}
          />
        )
      )}

      {editingResource && (
        <ModalEditWarehouses
          open={!!editingResource}
          onClose={() => setEditingResource(null)}
          onEdit={async (id, updates) => {
            return new Promise<void>((resolve, reject) => {
              updateResource.mutate(
                { id, data: updates },
                {
                  onSuccess: () => {
                    setEditingResource(null);
                    resolve();
                  },
                  onError: (error) => {
                    console.error("Error al editar recurso:", error);
                    reject(error);
                  },
                }
              );
            });
          }}
          resourceId={editingResource}
        />
      )}

      {editingProduct && selectedWarehouseProduct && (
        <ModalEditProductWarehouse
          producto={selectedWarehouseProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}

      {deletingResource && (
        <ModalDeleteWarehouses
          open={!!deletingResource}
          onClose={() => setDeletingResource(null)}
          onDelete={() => {
            if (deletingResource) {
              return deleteResource.mutate(deletingResource);
            }
            return undefined;
          }}
          onSuccess={() => {}}
          resourceId={deletingResource}
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