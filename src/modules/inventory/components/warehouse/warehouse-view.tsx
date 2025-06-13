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
  const [selectedType, setSelectedType] = useState<"producto" | "recurso">(
    "producto"
  );

  const [showWarehouses, setShowWarehouses] = useState(false);

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

  const filteredResources = enrichedResources?.filter((resource) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      resource.warehouse_name.toLowerCase().includes(searchLower) ||
      resource.resource_name.toLowerCase().includes(searchLower) ||
      resource.quantity.toString().includes(searchLower) ||
      new Date(resource.entry_date)
        .toLocaleDateString()
        .toLowerCase()
        .includes(searchLower)
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
    {/* Botón Almacenes azul, junto al filtro */}
    <button
      className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-blue-700 text-white hover:bg-blue-800 transition-colors"
      onClick={() => {
        setShowWarehouses(true)
      }}
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
        onClick={() => setSelectedType('producto')}
      >
        <Package size={18} /> Producto
      </button>
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${
          selectedType === 'recurso'
            ? 'bg-orange-500 text-white'
            : 'bg-white text-orange-500 border border-orange-500'
        }`}
        onClick={() => setSelectedType('recurso')}
      >
        <Users size={18} /> Recurso
      </button>
    </div>

      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        {selectedType === "producto" ? (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-800 dark:bg-gray-700 text-white">
              <tr>
                <th className="px-4 py-2 text-center">Almacén</th>
                <th className="px-4 py-2 text-center">ID Producto</th>
                <th className="px-4 py-2 text-center">Cantidad</th>
                <th className="px-4 py-2 text-center">Fecha de Entrada</th>
                <th className="px-4 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {warehouseProducts?.data.map((product) => (
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
                  <td className="px-4 py-2"></td>
                </tr>
              ))}
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
                    {searchTerm
                      ? "No se encontraron recursos que coincidan con la búsqueda"
                      : "No hay recursos registrados"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showCreate && (
        <ModalCreateWarehouses
          isOpen={showCreate}
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
