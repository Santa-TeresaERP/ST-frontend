/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { FiShoppingCart, FiPlus, FiEdit, FiTrash2, FiHelpCircle } from 'react-icons/fi';
import ModalCreateSales from './modal-create-sales';
import ModalEditSales from './modal-edit-sales';
import ModalDeleteSales from './modal-delete-sales';
import ModalDetailSales from './modal-details-sales';
import { useFetchSales, useDeleteSale } from '../../hooks/useSales';
import { salesAttributes } from '../../types/sales';

const SalesComponentsView: React.FC = () => {
  const { data: sales = [], isLoading, error } = useFetchSales();
  const deleteSleMutation = useDeleteSale();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState<salesAttributes | null>(null);

  const handleEditClick = (sale: salesAttributes) => {
    setCurrentSale(sale);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (sale: salesAttributes) => {
    setCurrentSale(sale);
    setIsDeleteModalOpen(true);
  };

  const handleDetailClick = (sale: salesAttributes) => {
    setCurrentSale(sale);
    setIsDetailModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (currentSale?.id) {
      deleteSleMutation.mutate(currentSale.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setCurrentSale(null);
        },
        onError: (error) => {
          console.error('Error deleting sale:', error);
        }
      });
    }
  };

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

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-6 text-gray-700">
      
      <div className="flex justify-end items-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-4 py-2 rounded-lg"
        >
          <FiPlus className="mr-2 h-5 w-5" />
          Nueva Venta
        </button>
      </div>

      <h2 className="text-2xl font-bold text-red-700 flex items-center space-x-2">
        <FiShoppingCart className="text-red-600" size={24} />
        <span>Información de Ventas</span>
      </h2>

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
            {sales.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No hay ventas registradas
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 text-center">{sale.store_id}</td>
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
                    <button
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteClick(sale)}
                      disabled={deleteSleMutation.isPending}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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

      <ModalDeleteSales
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteSleMutation.isPending}
      />
    </div>
  );
};

export default SalesComponentsView;