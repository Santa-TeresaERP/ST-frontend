import React from 'react';
import { X } from 'lucide-react';
import { salesAttributes } from '../../types/sales';
import { useFetchSalesDetails } from '../../hooks/useSalesDetails';
import { useFetchProducts } from '@/modules/production/hook/useProducts';

interface ModalDetailSalesProps {
  isOpen: boolean;
  onClose: () => void;
  saleDetail: salesAttributes | null;
}

const ModalDetailSales: React.FC<ModalDetailSalesProps> = ({ isOpen, onClose, saleDetail }) => {
  const { 
    data: allSalesDetails = [], 
    isLoading: loadingSalesDetails, 
    error: errorSalesDetails 
  } = useFetchSalesDetails();

  const { 
    data: allProducts = [], 
    isLoading: loadingProducts, 
    error: errorProducts 
  } = useFetchProducts();

  if (!isOpen || !saleDetail) return null;

  // Filtrar los detalles que pertenecen a esta venta específica
  const salesDetails = allSalesDetails.filter(detail => detail.saleId === saleDetail.id);

  // Función para obtener el nombre del producto por ID
  const getProductName = (productId: string) => {
    const product = allProducts.find(p => p.id === productId);
    return product?.name || 'Producto no encontrado';
  };

  // Estados de carga y error
  const isLoading = loadingSalesDetails || loadingProducts;
  const error = errorSalesDetails || errorProducts;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl relative overflow-hidden">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-600 hover:text-red-700 z-10"
        >
          <X size={24} />
        </button>

        <div className="p-6 space-y-5 text-gray-700 text-base">
          <h2 className="text-3xl font-bold text-center text-red-700 mb-4">Detalle de Venta</h2>

          {/* Información básica */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="font-semibold text-gray-800">
                Tienda: <span className="font-normal text-gray-600">{saleDetail.store_id}</span>
              </p>
              <p className="font-semibold text-gray-800">
                Fecha: <span className="font-normal text-gray-600">
                  {new Date(saleDetail.income_date).toLocaleDateString()}
                </span>
              </p>
            </div>
          </div>

          {/* Observaciones */}
          {saleDetail.observations && (
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-gray-800">
                Observaciones: <span className="font-normal text-gray-600">{saleDetail.observations}</span>
              </p>
            </div>
          )}

          {/* Productos vendidos */}
          <div>
            <p className="font-semibold text-lg text-gray-800 mb-3">Productos vendidos:</p>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                <div className="text-gray-500 ml-3">Cargando detalles...</div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-red-500">Error al cargar los detalles</div>
              </div>
            ) : salesDetails.length === 0 ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">No hay productos registrados en esta venta</div>
              </div>
            ) : (
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full text-center text-gray-700 text-base">
                  <thead className="bg-red-700 text-white">
                    <tr>
                      <th className="px-4 py-3">Producto</th>
                      <th className="px-4 py-3">Cantidad</th>
                      <th className="px-4 py-3">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesDetails.map((detail, index) => (
                      <tr key={detail.id} className={`border-t hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                        <td className="px-4 py-3 text-left">
                          <p className="font-medium text-gray-900">
                            {getProductName(detail.productId)}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                            {detail.quantity}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-gray-900">
                            S/ {detail.mount.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDetailSales;