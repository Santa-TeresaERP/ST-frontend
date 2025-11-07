import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { useCreateBuysProduct } from '../../hook/useBuysProducts';
import { useFetchWarehouses } from '../../hook/useWarehouses';
import { useFetchProducts } from '../../hook/useProducts';
import { useFetchSuppliers } from '../../hook/useSuppliers';

type ModalCreateBuysProductProps = {
  onClose: () => void;
};

const ModalCreateBuysProduct: React.FC<ModalCreateBuysProductProps> = ({ onClose }) => {
  const [warehouse_id, setWarehouseId] = useState('');
  const [product_id, setProductId] = useState('');
  const [supplier_id, setSupplierId] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [unit_price, setUnitPrice] = useState<number | ''>('');
  const [total_cost, setTotalCost] = useState<number>(0);
  const [entry_date, setEntryDate] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { mutate, status } = useCreateBuysProduct();
  const { data: warehouses, isLoading: loadingWarehouses } = useFetchWarehouses();
  const { data: products, isLoading: loadingProducts } = useFetchProducts();
  const { data: suppliers, isLoading: loadingSuppliers } = useFetchSuppliers();

  // Calcular total_cost automáticamente
  useEffect(() => {
    if (quantity && unit_price && quantity !== '' && unit_price !== '') {
      const calculated = Math.round(Number(quantity) * Number(unit_price) * 100) / 100;
      setTotalCost(calculated);
    } else {
      setTotalCost(0);
    }
  }, [quantity, unit_price]);

  // Establecer fecha de hoy por defecto
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setEntryDate(today);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validaciones
    if (!warehouse_id || warehouse_id.trim() === '' || warehouse_id === 'Seleccione un almacén') {
      setError('Debe seleccionar un almacén');
      return;
    }

    if (!product_id || product_id.trim() === '' || product_id === 'Seleccione un producto') {
      setError('Debe seleccionar un producto');
      return;
    }

    if (!supplier_id || supplier_id.trim() === '' || supplier_id === 'Seleccione un proveedor') {
      setError('Debe seleccionar un proveedor');
      return;
    }

    if (quantity === '' || Number(quantity) <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }

    if (unit_price === '' || Number(unit_price) <= 0) {
      setError('El precio unitario debe ser mayor a 0');
      return;
    }

    if (!entry_date) {
      setError('Debe seleccionar una fecha de entrada');
      return;
    }

    // Validar que la fecha no sea futura
    const selectedDate = new Date(entry_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate > today) {
      setError('La fecha de entrada no puede ser futura');
      return;
    }

    mutate(
      {
        warehouse_id,
        product_id,
        supplier_id,
        quantity: Number(quantity),
        unit_price: Number(unit_price),
        total_cost,
        entry_date,
      },
      {
        onSuccess: (response) => {
          // Mostrar mensaje según la acción del backend
          if (response.action === 'updated') {
            setSuccessMessage(response.message || 'Registro actualizado. Se acumularon las cantidades.');
          } else {
            setSuccessMessage('Compra registrada exitosamente');
          }
          
          // Cerrar modal después de 2 segundos
          setTimeout(() => {
            onClose();
          }, 2000);
        },
        onError: (err: any) => {
          const errorMessage = err?.response?.data?.error || err?.message || 'Error al registrar la compra';
          setError(errorMessage);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header con gradiente rojo */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-5 rounded-t-2xl flex items-center justify-center relative sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-center">Nueva Compra de Producto</h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-200"
          >
            <X size={22} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
          {/* Mensajes de error y éxito */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}
          
          {successMessage && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600 font-medium">{successMessage}</p>
            </div>
          )}

          {/* Grid de 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Almacén */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Almacén<span className="text-red-500">*</span>
              </label>
              <select
                value={warehouse_id}
                onChange={(e) => setWarehouseId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                disabled={loadingWarehouses}
              >
                <option value="">Seleccione un almacén</option>
                {warehouses?.filter(w => w.status).map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            {/* Producto */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Producto<span className="text-red-500">*</span>
              </label>
              <select
                value={product_id}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                disabled={loadingProducts}
              >
                <option value="">Seleccione un producto</option>
                {products?.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
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

            {/* Cantidad */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Cantidad<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0.01}
                step={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Ejemplo: 100"
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
                placeholder="Ejemplo: 15.50"
              />
            </div>

            {/* Costo Total (calculado) */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Costo Total (Calculado)<span className="text-red-500">*</span>
              </label>
              <div className="w-full border border-gray-300 bg-gray-50 rounded-lg px-4 py-2 text-gray-900 font-bold">
                S/. {total_cost.toFixed(2)}
              </div>
            </div>

            {/* Fecha de Entrada */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Fecha de Entrada<span className="text-red-500">*</span>
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

          {/* Nota informativa */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Nota:</strong> Si ya existe una compra con el mismo almacén y producto, 
              se acumularán las cantidades en lugar de crear un registro duplicado.
            </p>
          </div>

          {/* Botones */}
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
              disabled={status === 'pending'}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition flex items-center justify-center space-x-2 disabled:opacity-50"
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
