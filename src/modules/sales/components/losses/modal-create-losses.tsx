import React, { useState, useEffect, useRef } from "react";
import { X, Save } from "lucide-react";
import { FiAlertOctagon } from "react-icons/fi";
import { useCreateReturn } from "@/modules/sales/hooks/useReturns";
import { useFetchSales } from "@/modules/sales/hooks/useSales";
import { useFetchWarehouseStoreItems } from "@/modules/sales/hooks/useInventoryQueries";
import { returnsAttributes } from "../../types/returns";
import { returnSchema } from "@/modules/sales/schemas/returnsSchema";

interface ModalCreateLossProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: returnsAttributes) => void;
  selectedStoreId?: string;
}

const ModalCreateLoss: React.FC<ModalCreateLossProps> = ({
  isOpen,
  onClose,
  selectedStoreId,
}) => {
  const [productSearch, setProductSearch] = useState("");
  const [productId, setProductId] = useState("");
  const [salesSearch, setSalesSearch] = useState("");
  const [salesId, setSalesId] = useState("");
  const [reason, setReason] = useState("");
  const [observations, setObservations] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [localError, setLocalError] = useState("");

  const { data: storeInventory = [] } = useFetchWarehouseStoreItems();
  const { data: sales = [] } = useFetchSales();
  const { mutateAsync } = useCreateReturn();

  const productDropdownRef = useRef<HTMLDivElement>(null);
  const salesDropdownRef = useRef<HTMLDivElement>(null);
  const [showSalesDropdown, setShowSalesDropdown] = useState(false);
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);

  const filteredInventory = storeInventory.filter(
    (item) => item.storeId === selectedStoreId && item.quantity > 0
  );

  const filteredProducts = productSearch
    ? filteredInventory.filter((item) =>
        item.product.name.toLowerCase().includes(productSearch.toLowerCase())
      )
    : filteredInventory;

  const filteredSales = sales.filter((sale) => {
    const belongsToStore = selectedStoreId
      ? sale.store_id === selectedStoreId
      : true;
    const formattedDate = new Date(sale.income_date).toLocaleString("es-PE");
    const matchesSearch =
      formattedDate.toLowerCase().includes(salesSearch.toLowerCase()) ||
      sale.total_income.toString().includes(salesSearch);
    return belongsToStore && matchesSearch;
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
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
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId || !salesId || !reason || !observations) {
      setLocalError("Por favor, completa todos los campos.");
      return;
    }

    // Validar que hay tienda seleccionada
    if (!selectedStoreId) {
      setLocalError("Debes seleccionar una tienda antes de registrar pérdidas.");
      return;
    }

    try {
      const data = {
        product_id: productId,
        sale_id: salesId,
        reason,
        observations,
        quantity,
        store_id: selectedStoreId,
      };

      // Validate data with returnSchema
      const validation = returnSchema.safeParse(data);
      if (!validation.success) {
        setLocalError("Datos inválidos: " + validation.error.errors.map(e => e.message).join(", "));
        return;
      }

      await mutateAsync(validation.data);
      onClose();
      setProductSearch("");
      setProductId("");
      setSalesSearch("");
      setSalesId("");
      setReason("");
      setObservations("");
      setQuantity(1);
    } catch (error) {
      console.error("Error al guardar la pérdida:", error);
      setLocalError("Hubo un error al guardar la pérdida.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl relative mx-2">
        <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-5 rounded-t-2xl flex items-center justify-center relative gap-2">
          <FiAlertOctagon size={24} />
          <h2 className="text-xl font-semibold text-center">
            Registrar Pérdida
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
          {localError && (
            <p className="text-sm text-red-600 font-medium">{localError}</p>
          )}

          {!selectedStoreId && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                ⚠️ <strong>Tienda requerida:</strong> Debes seleccionar una tienda en el panel principal antes de registrar pérdidas.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {/* Selector de producto */}
            <div className="relative" ref={productDropdownRef}>
              <label className="block text-gray-700 mb-1 font-medium">
                Producto <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setProductId("");
                  setShowProductsDropdown(true);
                }}
                onFocus={() => setShowProductsDropdown(true)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                placeholder="Buscar producto por nombre"
              />

              {showProductsDropdown && (
                <ul className="absolute z-10 bg-white border border-gray-300 mt-1 w-full rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((item) => (
                      <li
                        key={item.product.id}
                        className="px-4 py-2 hover:bg-red-100 cursor-pointer text-sm"
                        onClick={() => {
                          setProductSearch(item.product.name);
                          setProductId(item.product.id);
                          setShowProductsDropdown(false);
                        }}
                      >
                        {item.product.name} ({item.quantity} disponibles)
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500 text-sm text-center cursor-default">
                      No hay productos disponibles para la tienda en este
                      momento.
                    </li>
                  )}
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
                  setSalesId("");
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
                        .sort((a, b) => new Date(b.income_date).getTime() - new Date(a.income_date).getTime())
                        .slice(0, 3)
                  ).map((sale) => (
                    <li
                      key={sale.id}
                      className="px-4 py-2 hover:bg-red-100 cursor-pointer text-sm"
                      onClick={() => {
                        const formatted = new Date(sale.income_date).toLocaleString("es-PE");
                        setSalesSearch(`${formatted} - S/ ${sale.total_income}`);
                        setSalesId(sale.id!);
                        setShowSalesDropdown(false);
                      }}
                    >
                      🗕️ {new Date(sale.income_date).toLocaleString("es-PE")} — 💵 S/ {sale.total_income}
                    </li>
                  ))}
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
                value={quantity}
                min={1}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                placeholder="Cantidad de productos devueltos"
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
                placeholder="Razón de la pérdida"
              />
            </div>

            {/* Observaciones */}
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
              disabled={!selectedStoreId}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                selectedStoreId 
                  ? 'bg-red-800 text-white hover:bg-red-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save size={18} /> 
              {selectedStoreId ? 'Guardar' : 'Selecciona Tienda'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateLoss;
