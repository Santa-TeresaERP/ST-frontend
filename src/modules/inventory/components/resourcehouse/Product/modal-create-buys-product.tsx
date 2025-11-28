import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { useCreateBuysProduct } from '../../../hook/useBuysProducts';
import { useFetchSuppliers } from '../../../hook/useSuppliers';
import { BuysProductResponse } from '@/modules/inventory/types/buysProduct';
import ProductPurchasedSearchInput from './ProductPurchasedSearchInput';
import { useFetchCategories } from '@/modules/production/hook/useCategories';

type ModalCreateBuysProductProps = {
  onClose: () => void;
};

const ModalCreateBuysProduct: React.FC<ModalCreateBuysProductProps> = ({ onClose }) => {
  // Datos del formulario
  const [purchaseName, setPurchaseName] = useState('');
  const [supplier_id, setSupplierId] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [unit_price, setUnitPrice] = useState<number | ''>('');
  const [total_cost, setTotalCost] = useState<number>(0);
  const [entry_date, setEntryDate] = useState('');

  const [productPurchasedId, setProductPurchasedId] = useState<string>('');

  // Estados de UI
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [productSelectionError, setProductSelectionError] = useState('');

  const { mutate, status } = useCreateBuysProduct();
  const { data: suppliers, isLoading: loadingSuppliers } = useFetchSuppliers();
  const {
    data: categoriesList,
    isLoading: loadingCategories,
    error: categoriesError,
  } = useFetchCategories();

  // Calcular total (Precio Unitario * Cantidad)
  useEffect(() => {
    if (quantity && unit_price) {
      const calculated = Math.round(Number(quantity) * Number(unit_price) * 100) / 100;
      setTotalCost(calculated);
    } else {
      setTotalCost(0);
    }
  }, [quantity, unit_price]);

  // Fecha por defecto: hoy
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setEntryDate(today);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setProductSelectionError('');
    setSuccessMessage('');

    // Validaciones
    if (!purchaseName.trim() || !productPurchasedId) {
      const message = 'Debe seleccionar o crear un producto comprado';
      setProductSelectionError(message);
      setError(message);
      return;
    }
    if (!supplier_id) {
      setError('Debe seleccionar un proveedor');
      return;
    }
    if (!category.trim()) {
      setError('Debe ingresar una categoría');
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }
    if (!unit_price || Number(unit_price) <= 0) {
      setError('El precio unitario debe ser mayor a 0');
      return;
    }
    if (!entry_date) {
      setError('Debe seleccionar una fecha');
      return;
    }
    
    // El objeto para mutate ahora incluye todos los campos requeridos:
    // name, category, product_purchased_id, supplier_id, quantity, unit_price, total_cost, entry_date
    mutate(
      {
        name: purchaseName,
        supplier_id,
        category,
        product_purchased_id: productPurchasedId,
        quantity: Number(quantity),
        unit_price: Number(unit_price),
        total_cost,
        entry_date,
      },
      {
        onSuccess: (data: BuysProductResponse) => {
          // Usamos el tipo BuysProductResponse para tener una mejor experiencia de desarrollo
          setSuccessMessage(data.message || 'Compra registrada exitosamente');
          setTimeout(() => {
            onClose();
          }, 1800);
        },
        onError: (err: unknown) => {
          type ApiError = {
            response?: {
              data?: {
                error?: string;
              };
            };
          };

          const apiError = err as ApiError;
          const errorMessage = apiError.response?.data?.error || 'Error al registrar la compra';
          setError(errorMessage);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-5 rounded-t-2xl flex items-center justify-center relative">
          <h2 className="text-lg font-semibold">Registrar Compra</h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-200"
          >
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="text-red-600" size={18} />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Nombre */}
            <div className="md:col-span-2">
              <ProductPurchasedSearchInput
                label="Nombre de la compra"
                placeholder="Buscar o crear un producto comprado..."
                required
                onProductSelect={({ id, name }) => {
                  setProductPurchasedId(id);
                  setPurchaseName(name);
                  setProductSelectionError('');
                }}
                error={productSelectionError}
              />
            </div>

            {/* Proveedor */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1 font-medium">
                Proveedor<span className="text-red-500">*</span>
              </label>
              <select
                value={supplier_id}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                disabled={loadingSuppliers}
              >
                <option value="">Seleccione un proveedor</option>
                {suppliers?.filter(s => s.status).map((s) => (
                  <option key={s.id} value={s.id}>{s.suplier_name}</option>
                ))}
              </select>
            </div>

            {/* Categoría */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1 font-medium">
                Categoría<span className="text-red-500">*</span>
              </label>
              {loadingCategories ? (
                <div className="animate-pulse h-10 bg-gray-200 rounded-lg" />
              ) : categoriesError ? (
                <p className="text-sm text-red-500">
                  No se pudieron cargar las categorías.
                </p>
              ) : categoriesList && categoriesList.length > 0 ? (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="">Seleccione una categoría</option>
                  {categoriesList
                    .filter((cat) => cat.status)
                    .map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              ) : (
                <p className="text-sm text-gray-500">
                  Aún no hay categorías registradas. Cree una desde producción para seleccionarla aquí.
                </p>
              )}
            </div>

            {/* Cantidad */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Cantidad<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Ej: 10"
              />
            </div>

            {/* Precio Unitario */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Precio Unitario<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0.01}
                step={0.01}
                value={unit_price}
                onChange={(e) => setUnitPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Ej: 12.50"
              />
            </div>

            {/* Total */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1 font-medium">
                Total (calculado)
              </label>
              <div className="w-full border border-gray-300 bg-gray-50 rounded-lg px-4 py-2 font-bold text-gray-900">
                S/. {total_cost.toFixed(2)}
              </div>
            </div>

            {/* Fecha */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1 font-medium">
                Fecha de Compra<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={entry_date}
                onChange={(e) => setEntryDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={status === 'pending'}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2 disabled:opacity-50"
            >
              <Save size={18} />
              <span>{status === 'pending' ? 'Guardando...' : 'Guardar'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default ModalCreateBuysProduct;