import React, { useState, useEffect, useRef } from 'react';
import { X, Save } from 'lucide-react';
import { FiAlertOctagon } from 'react-icons/fi';
import { useFetchProducts } from '@/modules/inventory/hook/useProducts';
import { useFetchSales } from '@/modules/sales/hooks/useSales';

interface Loss {
  id: string;
  productId: string;
  salesId: string;
  reason: string;
  observations: string;
  quantity: number;
  createdAt?: string
  updatedAt?: string;
}

interface ModalEditLossProps {
  isOpen: boolean;
  onClose: () => void;
  currentLoss: Loss | null;
  onSave: (updatedLoss: Omit<Loss, 'id' | 'createdAt'>) => void;
  selectedStoreId?: string;
}

const ModalEditLoss: React.FC<ModalEditLossProps> = ({
  isOpen,
  onClose,
  currentLoss,
  onSave,
  selectedStoreId
}) => {
  const [productSearch, setProductSearch] = useState('');
  const [productId, setProductId] = useState('');
  const [salesSearch, setSalesSearch] = useState('');
  const [salesId, setSalesId] = useState('');
  const [reason, setReason] = useState('');
  const [observations, setObservations] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [localError, setLocalError] = useState('');

  const { data: products = [] } = useFetchProducts();
  const { data: sales = [] } = useFetchSales();

  const salesDropdownRef = useRef<HTMLDivElement>(null);
  const productDropdownRef = useRef<HTMLDivElement>(null);

  const [showSalesDropdown, setShowSalesDropdown] = useState(false);
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);

  const filteredProducts = productSearch
    ? products.filter((p) =>
        p.name.toLowerCase().includes(productSearch.toLowerCase())
      )
    : [];

  const filteredSales = sales.filter((sale) => {
    const belongsToStore = selectedStoreId
      ? sale.store_id === selectedStoreId
      : true;
    const formattedDate = new Date(sale.income_date).toLocaleString('es-PE');
    const matchesSearch =
      formattedDate.toLowerCase().includes(salesSearch.toLowerCase()) ||
      sale.total_income.toString().includes(salesSearch);
    return belongsToStore && matchesSearch;
  });

  useEffect(() => {
    if (currentLoss && products.length > 0 && sales.length > 0) {
      const product = products.find(p => p.id === currentLoss.productId);
      const sale = sales.find(s => s.id === currentLoss.salesId);
      const formattedDate = sale ? new Date(sale.income_date).toLocaleString('es-PE') : '';

      setProductId(currentLoss.productId || '');
      setProductSearch(product?.name || '');

      setSalesId(currentLoss.salesId || '');
      setSalesSearch(sale ? `${formattedDate} - S/ ${sale.total_income}` : '');

      setReason(currentLoss.reason || '');
      setObservations(currentLoss.observations || '');
      setQuantity(currentLoss.quantity || 1);
    }
  }, [currentLoss, products, sales]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        salesDropdownRef.current &&
        !salesDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSalesDropdown(false);
      }
      if (
        productDropdownRef.current &&
        !productDropdownRef.current.contains(event.target as Node)
      ) {
        setShowProductsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId || !salesId || !reason || !observations || quantity <= 0) {
      setLocalError('Por favor, completa todos los campos correctamente.');
      return;
    }

    onSave({ productId, salesId, reason, observations, quantity });
    onClose();
  };

  if (!isOpen || !currentLoss) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl relative">
        <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-5 rounded-t-2xl flex items-center justify-center relative gap-2">
          <FiAlertOctagon size={24} />
          <h2 className="text-xl font-semibold text-center">Editar Pérdida</h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
          {localError && <p className="text-sm text-red-600 font-medium">{localError}</p>}

          <div className="space-y-4">
            {/* Producto */}
            <div className="relative" ref={productDropdownRef}>
              <label className="block text-gray-700 mb-1 font-medium">
                Producto <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setProductId('');
                  setShowProductsDropdown(true);
                }}
                onFocus={() => setShowProductsDropdown(true)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                placeholder="Buscar producto por nombre"
              />
              {showProductsDropdown && filteredProducts.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 mt-1 w-full rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <li
                      key={product.id}
                      className="px-4 py-2 hover:bg-red-100 cursor-pointer text-sm"
                      onClick={() => {
                        setProductSearch(product.name);
                        setProductId(product.id);
                        setShowProductsDropdown(false);
                      }}
                    >
                      {product.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Venta */}
            <div className="relative" ref={salesDropdownRef}>
              <label className="block text-gray-700 mb-1 font-medium">
                Venta <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={salesSearch}
                onChange={(e) => {
                  setSalesSearch(e.target.value);
                  setSalesId('');
                  setShowSalesDropdown(true);
                }}
                onFocus={() => setShowSalesDropdown(true)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                placeholder="Buscar por fecha o monto"
              />
              {showSalesDropdown && (
                <ul className="absolute z-10 bg-white border border-gray-300 mt-1 w-full rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {(salesSearch
                    ? filteredSales
                    : [...filteredSales]
                        .sort((a, b) =>
                          new Date(b.income_date).getTime() - new Date(a.income_date).getTime()
                        )
                        .slice(0, 3)
                  ).map((sale) => {
                    const formatted = new Date(sale.income_date).toLocaleString('es-PE');
                    return (
                      <li
                        key={sale.id}
                        className="px-4 py-2 hover:bg-red-100 cursor-pointer text-sm"
                        onClick={() => {
                          setSalesSearch(`${formatted} - S/ ${sale.total_income}`);
                          setSalesId(sale.id!);
                          setShowSalesDropdown(false);
                        }}
                      >
                        📅 {formatted} — 💵 S/ {sale.total_income}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Cantidad */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Cantidad <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                placeholder="Cantidad de productos perdidos"
              />
            </div>

            {/* Razón */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Razón <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                placeholder="Motivo de la pérdida"
              />
            </div>

            {/* Observación */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Observación <span className="text-red-600">*</span>
              </label>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                placeholder="Detalle u observaciones"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
            >
              <Save size={18} /> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditLoss;
