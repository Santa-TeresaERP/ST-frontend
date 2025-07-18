import React, { useState } from "react";
import { X, Save } from "lucide-react";
import { FiAlertOctagon } from "react-icons/fi";
import { useCreateReturn } from "@/modules/sales/hooks/useReturns";
import { useFetchProducts } from "@/modules/inventory/hook/useProducts";
import { useFetchSales } from "@/modules/sales/hooks/useSales";
import { useEffect, useRef } from "react";

interface ModalCreateLossProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const ModalCreateLoss: React.FC<ModalCreateLossProps> = ({
  isOpen,
  onClose,
}) => {
  const [productSearch, setProductSearch] = useState("");
  const [productId, setProductId] = useState("");
  const [salesSearch, setSalesSearch] = useState("");
  const [salesId, setSalesId] = useState("");
  const [reason, setReason] = useState("");
  const [observations, setObservations] = useState("");
  const [localError, setLocalError] = useState("");

  const { data: products = [] } = useFetchProducts();
  const { data: sales = [] } = useFetchSales();
  const createReturnMutation = useCreateReturn();

  const filteredProducts = productSearch
    ? products.filter((p) =>
        p.name.toLowerCase().includes(productSearch.toLowerCase())
      )
    : [];

  const filteredSales = sales.filter((sale) => {
    const formattedDate = new Date(sale.income_date).toLocaleString("es-PE");
    return (
      formattedDate.toLowerCase().includes(salesSearch.toLowerCase()) ||
      sale.total_income.toString().includes(salesSearch)
    );
  });
  const salesDropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú si se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        salesDropdownRef.current &&
        !salesDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSalesDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [showSalesDropdown, setShowSalesDropdown] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId || !salesId || !reason || !observations) {
      setLocalError("Por favor, completa todos los campos.");
      return;
    }

    try {
      await createReturnMutation.mutateAsync({
        productId,
        salesId,
        reason,
        observations,
      });
      onClose();
      setProductSearch("");
      setProductId("");
      setSalesSearch("");
      setSalesId("");
      setReason("");
      setObservations("");
      setLocalError("");
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

          <div className="space-y-4">
            {/* Selector de producto */}
            <div className="relative">
              <label className="block text-gray-700 mb-1 font-medium">
                Producto <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setProductId("");
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                placeholder="Buscar producto por nombre"
              />
              {filteredProducts.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 mt-1 w-full rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <li
                      key={product.id}
                      className="px-4 py-2 hover:bg-red-100 cursor-pointer text-sm"
                      onClick={() => {
                        setProductSearch(product.name);
                        setProductId(product.id);
                      }}
                    >
                      {product.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Selector de venta */}
            <div className="relative" ref={salesDropdownRef}>
              <label className="block text-gray-700 mb-1 font-medium">
                Venta <span className="text-red-600">*</span>
              </label>
              <div className="flex items-center gap-2">
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
                <button
                  type="button"
                  onClick={() => setShowSalesDropdown(!showSalesDropdown)}
                  className="text-gray-700 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg border"
                  title="Mostrar todo"
                >
                  {showSalesDropdown ? "⏶" : "⏷"}
                </button>
              </div>

              {showSalesDropdown &&
                (filteredSales.length > 0 || salesSearch === "") && (
                  <ul className="absolute z-10 bg-white border border-gray-300 mt-1 w-full rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {(salesSearch
                      ? filteredSales
                      : sales.slice(-3).reverse()
                    ).map((sale) => {
                      const formatted = new Date(
                        sale.income_date
                      ).toLocaleString("es-PE");
                      return (
                        <li
                          key={sale.id}
                          className="px-4 py-2 hover:bg-red-100 cursor-pointer text-sm"
                          onClick={() => {
                            setSalesSearch(
                              `${formatted} - S/ ${sale.total_income}`
                            );
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
              className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
            >
              <Save size={18} /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateLoss;
