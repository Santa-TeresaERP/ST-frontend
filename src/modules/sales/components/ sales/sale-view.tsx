// Importación de React y otros componentes necesarios
import React, { useState } from 'react';
import { FiShoppingCart, FiPlus, FiEdit, FiHelpCircle } from 'react-icons/fi';
import ModalCreateSales from './modal-create-sales';
import ModalEditSales from './modal-edit-sales';
import ModalDetailSales from './modal-details-sales';
import { useFetchSales } from '../../hooks/useSales';
import { useFetchStores } from '@/modules/stores/hook/useStores';
import { salesAttributes } from '../../types/sales';
import { StoreAttributes } from '@/modules/stores/types/store';

// Agregué una interfaz para aceptar la tienda seleccionada como prop
interface SalesComponentsViewProps {
  selectedStore: StoreAttributes | null; // La tienda seleccionada puede ser nula
}

const SalesComponentsView: React.FC<SalesComponentsViewProps> = ({ selectedStore }) => {
  // Obtengo las ventas y las tiendas usando los hooks correspondientes
  const { data: sales = [], isLoading, error } = useFetchSales();
  const { data: stores = [] } = useFetchStores();

  // Estados para manejar los modales y la venta actual
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState<salesAttributes | null>(null);

  // Función para manejar la edición de una venta
  const handleEditClick = (sale: salesAttributes) => {
    setCurrentSale(sale);
    setIsEditModalOpen(true);
  };

  // Función para manejar la visualización de detalles de una venta
  const handleDetailClick = (sale: salesAttributes) => {
    setCurrentSale(sale);
    setIsDetailModalOpen(true);
  };

  // Función para obtener el nombre de la tienda por su ID
  const getStoreName = (storeId: string) => {
    const store = stores.find((store) => store.id === storeId);
    return store?.store_name || 'Tienda no encontrada';
  };

  // Manejo de estados de carga y error
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-6 text-gray-700">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Cargando ventas...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-6 text-gray-700">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Error al cargar las ventas: {error.message}</div>
        </div>
      </div>
    );
  }

  // Filtré las ventas según la tienda seleccionada
  const filteredSales = selectedStore
    ? sales.filter((sale) => sale.store_id === selectedStore.id) // Solo mostrar ventas de la tienda seleccionada
    : sales; // Si no hay tienda seleccionada, mostrar todas las ventas

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-6 text-gray-700">
      {/* Botón para abrir el modal de creación de ventas */}
      <div className="flex justify-end items-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-4 py-2 rounded-lg"
        >
          <FiPlus className="mr-2 h-5 w-5" />
          Nueva Venta
        </button>
      </div>

      {/* Título de la sección */}
      <h2 className="text-2xl font-bold text-red-700 flex items-center space-x-2">
        <FiShoppingCart className="text-red-600" size={24} />
        <span>Información de Ventas</span>
      </h2>

      {/* Tabla de ventas */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm bg-white">
        <table className="min-w-full text-left text-gray-700">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 text-center">Tienda</th>
              <th className="px-4 py-2 text-center">Costo Total</th>
              <th className="px-4 py-2 text-center">Fecha</th>
              <th className="px-4 py-2 text-center">Observación</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.length === 0 ? (
              // Mostrar mensaje si no hay ventas
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No hay ventas registradas
                </td>
              </tr>
            ) : (
              // Renderizar las ventas filtradas
              filteredSales.map((sale) => (
                <tr key={sale.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 text-center">{getStoreName(sale.store_id)}</td>
                  <td className="px-4 py-2 text-center">S/ {sale.total_income?.toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">{new Date(sale.income_date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-center">{sale.observations}</td>
                  <td className="px-4 py-2 text-center flex justify-center space-x-3">
                    <button
                      className="text-green-600 hover:text-green-800"
                      onClick={() => handleDetailClick(sale)}
                    >
                      <FiHelpCircle size={18} />
                    </button>
                    <button
                      className="text-blue-500 hover:text-yellow-600"
                      onClick={() => handleEditClick(sale)}
                    >
                      <FiEdit size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modales */}
      <ModalCreateSales isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <ModalDetailSales
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        saleDetail={currentSale}
      />

      <ModalEditSales
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentSale={currentSale}
        onSave={() => {
          setIsEditModalOpen(false);
          setCurrentSale(null);
        }}
      />
    </div>
  );
};

export default SalesComponentsView;