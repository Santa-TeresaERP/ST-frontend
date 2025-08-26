import React, { useState, useEffect, useRef, useMemo } from "react";
import { X, Save } from "lucide-react";
import { FiAlertOctagon } from "react-icons/fi";
import { useCreateReturn } from "@/modules/sales/hooks/useReturns";
import { useFetchSales } from "@/modules/sales/hooks/useSales";
import { useFetchSalesDetails } from "@/modules/sales/hooks/useSalesDetails";
import { useFetchReturns } from "@/modules/sales/hooks/useReturns";
import { useFetchWarehouseStoreItems } from "@/modules/sales/hooks/useInventoryQueries";
import { returnsAttributes } from "../../types/returns";

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
  const { data: salesDetails = [] } = useFetchSalesDetails();
  const { data: existingReturns = [] } = useFetchReturns();
  const { mutateAsync, isPending } = useCreateReturn();

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

  // Calcular la cantidad disponible en inventario o venta
  const { availableQuantity, source, maxAvailable } = useMemo(() => {
    if (!productId) return { availableQuantity: 0, source: 'inventario', maxAvailable: 0 };
    
    // Si hay una venta seleccionada, validar contra la cantidad vendida
    if (salesId) {
      // Obtener la cantidad vendida del detalle de venta
      const saleDetail = salesDetails.find(detail => 
        detail.saleId === salesId && detail.productId === productId
      );
      
      if (!saleDetail) return { availableQuantity: 0, source: 'venta', maxAvailable: 0 };
      
      // Calcular pérdidas previas para esta venta y producto
      const lossesForThisSale = existingReturns
        .filter(ret => 
          ret.salesId === salesId && 
          ret.productId === productId
        )
        .reduce((sum, ret) => sum + (ret.quantity || 0), 0);
      
      const soldQty = saleDetail.quantity || 0;
      const remainingQty = Math.max(0, soldQty - lossesForThisSale);
      
      return {
        availableQuantity: remainingQty,
        source: 'venta',
        maxAvailable: soldQty
      };
    }
    
    // Si no hay venta seleccionada, usar la cantidad en inventario
    const inventoryItem = storeInventory.find(item => 
      item.productId === productId && item.storeId === selectedStoreId
    );
    
    const inventoryQty = inventoryItem?.quantity || 0;
    
    return {
      availableQuantity: inventoryQty,
      source: 'inventario',
      maxAvailable: inventoryQty
    };
  }, [salesId, productId, salesDetails, existingReturns, storeInventory, selectedStoreId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    
    // Validación de campos requeridos
    if (!productId) {
      setLocalError("Por favor seleccione un producto");
      return;
    }
    
    if (quantity <= 0) {
      setLocalError("La cantidad debe ser mayor a cero");
      return;
    }
    
    // Validar que no se exceda la cantidad disponible
    if (salesId && quantity > availableQuantity) {
      setLocalError(`La cantidad excede el máximo disponible en la venta (${availableQuantity})`);
      return;
    }
    
    // Validar inventario si no hay venta seleccionada
    if (!salesId) {
      const inventoryItem = storeInventory.find(item => 
        item.productId === productId && item.storeId === selectedStoreId
      );
      
      if (!inventoryItem || inventoryItem.quantity < quantity) {
        setLocalError(`No hay suficiente inventario disponible (${inventoryItem?.quantity || 0} disponibles)`);
        return;
      }
    }
    
    try {
      if (!selectedStoreId) {
        setLocalError("No se ha seleccionado una tienda válida.");
        return;
      }
      const newLoss: Omit<returnsAttributes, 'id' | 'createdAt' | 'updatedAt' | 'price'> = {
        productId,
        storeId: selectedStoreId,
        salesId: salesId || undefined,
        reason: reason || (salesId ? "Devolución de venta" : "Pérdida de inventario"),
        observations: observations || (salesId 
          ? `Pérdida registrada desde venta` 
          : `Pérdida registrada directamente de inventario`),
        quantity,
      };
      
      await mutateAsync(newLoss);
      onClose();
    } catch (error: unknown) {
      console.error("Error al registrar la pérdida:", error);
      const errorMessage = error && typeof error === 'object' && 'response' in error && 
                         error.response && typeof error.response === 'object' && 'data' in error.response &&
                         error.response.data && typeof error.response.data === 'object' && 'error' in error.response.data
                       ? String(error.response.data.error)
                       : "Error al registrar la pérdida. Intente nuevamente.";
      setLocalError(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg relative mx-auto my-8">
        <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-5 rounded-t-2xl flex items-center justify-center relative gap-2">
          <FiAlertOctagon size={24} />
          <h2 className="text-xl font-semibold text-center">
            Registrar Pérdida
          </h2>
          <button
            type="button"
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
                ⚠️ <strong>Tienda requerida:</strong> Debes seleccionar una
                tienda en el panel principal antes de registrar pérdidas.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {/* Mostrar información de disponibilidad */}
            {productId && (
              <div className={`p-3 ${salesId ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-200'} border rounded-lg`}>
                <p className="text-sm text-gray-800">
                  <strong>Disponible para pérdidas:</strong> {availableQuantity} unidad(es)
                  <br />
                  <span className="text-xs text-gray-600">
                    {salesId 
                      ? `(de la venta seleccionada: ${maxAvailable} unidades vendidas)`
                      : `(en inventario: ${maxAvailable} unidades disponibles)`}
                  </span>
                </p>
              </div>
            )}

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
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sale">
                Venta (opcional)
              </label>
              <div className="relative" ref={salesDropdownRef}>
                <input
                  type="text"
                  id="sale"
                  value={salesSearch}
                  onChange={(e) => {
                    setSalesSearch(e.target.value);
                    setShowSalesDropdown(true);
                  }}
                  onFocus={() => setShowSalesDropdown(true)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Buscar venta por fecha o monto (opcional)..."
                />
                {salesSearch && (
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      setSalesId("");
                      setSalesSearch("");
                      setShowSalesDropdown(false);
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
                {showSalesDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 font-medium"
                      onClick={() => {
                        setSalesId("");
                        setSalesSearch("");
                        setShowSalesDropdown(false);
                      }}
                    >
                      Sin venta (descontar de inventario)
                    </div>
                    {filteredSales.length > 0 ? (
                      filteredSales.map((sale) => (
                        <div
                          key={sale.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            if (sale.id) setSalesId(sale.id);
                            setSalesSearch(new Date(sale.income_date).toLocaleString("es-PE"));
                            setShowSalesDropdown(false);
                          }}
                        >
                          {new Date(sale.income_date).toLocaleString("es-PE")} - S/ {sale.total_income}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">No se encontraron ventas</div>
                    )}
                  </div>
                )}
              </div>
              {salesId && (
                <p className="mt-1 text-sm text-gray-500">
                  Descontando de la venta seleccionada
                </p>
              )}
            </div>

            {/* Cantidad */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                Cantidad *
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="bg-gray-200 px-3 py-1 rounded-l-lg hover:bg-gray-300"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={availableQuantity}
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    setQuantity(Math.min(value, availableQuantity));
                  }}
                  className="w-16 text-center border-t border-b border-gray-300 py-1"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(prev => Math.min(prev + 1, availableQuantity))}
                  className="bg-gray-200 px-3 py-1 rounded-r-lg hover:bg-gray-300"
                  disabled={quantity >= availableQuantity}
                >
                  +
                </button>
              </div>
              {availableQuantity > 0 && (
                <p className="mt-1 text-sm text-gray-500">
                  Disponible en {source}: {availableQuantity} unidades
                  {source === 'venta' && maxAvailable > 0 && ` (de ${maxAvailable} unidades vendidas)`}
                </p>
              )}
            </div>

            {/* Razón */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Razón <span className="text-red-600">*</span>
              </label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none bg-white"
                required
              >
                <option value="">Selecciona una razón</option>
                <option value="transporte">Transporte</option>
                <option value="caducado">Caducado</option>
                {/* Solo mostrar 'devuelto' si hay venta seleccionada */}
                {salesId && <option value="devuelto">Devuelto</option>}
              </select>
              {/* Mensaje si intenta seleccionar devuelto sin venta */}
              {!salesId && reason === 'devuelto' && (
                <p className="text-xs text-red-600 mt-1">No es posible seleccionar la razón Devuelto sin asociar una venta.</p>
              )}
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Observación
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
              disabled={!selectedStoreId || isPending}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                selectedStoreId && !isPending
                  ? "bg-red-800 text-white hover:bg-red-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Save size={18} />
              {isPending ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateLoss;
