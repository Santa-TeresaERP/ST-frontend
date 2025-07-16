import React from 'react';
import { X } from 'lucide-react';

interface Product {
  nombre: string;
  cantidad: number;
  costo: number;
}

interface ModalDetailSalesProps {
  isOpen: boolean;
  onClose: () => void;
  saleDetail: {
    tienda: string;
    fecha: string;
    productos: Product[];
    totalVenta: number;
  } | null;
}

const ModalDetailSales: React.FC<ModalDetailSalesProps> = ({ isOpen, onClose, saleDetail }) => {
  if (!isOpen || !saleDetail) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative overflow-hidden">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-600 hover:text-red-700"
        >
          <X size={24} />
        </button>

        <div className="p-6 space-y-5 text-gray-700 text-base">
          <h2 className="text-3xl font-bold text-center text-red-700 mb-2">Detalle de Venta</h2>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center">
            <p className="font-semibold text-gray-800">
              Tienda: <span className="font-normal text-gray-600">{saleDetail.tienda}</span>
            </p>
            <p className="font-semibold text-gray-800">
              <span className="font-normal text-gray-600">{saleDetail.fecha}</span>
            </p>
          </div>

          <div>
            <p className="font-semibold text-lg text-gray-800 mb-2">Productos:</p>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full text-center text-gray-700 text-base">
                <thead className="bg-red-700 text-white">
                  <tr>
                    <th className="px-4 py-2">Producto</th>
                    <th className="px-4 py-2">Cantidad</th>
                    <th className="px-4 py-2">Costo</th>
                  </tr>
                </thead>
                <tbody>
                  {saleDetail.productos.map((prod, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{prod.nombre}</td>
                      <td className="px-4 py-2">{prod.cantidad}</td>
                      <td className="px-4 py-2">S/ {prod.costo.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <p className="text-gray-900 font-bold text-xl">
              Total de Venta: <span className="text-red-700">S/ {saleDetail.totalVenta.toFixed(2)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDetailSales;
