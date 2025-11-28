import React, { useEffect, useRef, useState } from 'react';
import { Search, Plus, X, Loader2, Package } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import {
  useProductPurchasedSearch,
  ProductPurchasedSearchResult,
} from '../../../hook/useProductPurchased';

interface ProductPurchasedSearchInputProps {
  label?: string;
  placeholder?: string;
  onProductSelect: (product: { id: string; name: string }) => void;
  className?: string;
  required?: boolean;
  error?: string;
}

const ProductPurchasedSearchInput: React.FC<ProductPurchasedSearchInputProps> = ({
  label = 'Producto comprado',
  placeholder = 'Buscar producto comprado...',
  onProductSelect,
  className = '',
  required = false,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [pendingNewProduct, setPendingNewProduct] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    searchTerm,
    setSearchTerm,
    suggestions,
    selectedProduct,
    isLoading,
    isCreatingNew,
    handleSelectProduct,
    handleCreateNewProduct,
    clearSelection,
  } = useProductPurchasedSearch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProductSelection = async (product: ProductPurchasedSearchResult) => {
    if (product.isExisting) {
      const selected = await handleSelectProduct(product);
      if (selected) {
        onProductSelect({ id: selected.id, name: selected.name });
      }
      setIsOpen(false);
    } else {
      setPendingNewProduct(product.name);
      setShowCreateDialog(true);
      setIsOpen(false);
    }
  };

  const handleCreateWithDescription = async () => {
    if (!pendingNewProduct.trim()) return;

    try {
      const newProduct = await handleCreateNewProduct(
        pendingNewProduct,
        newProductDescription
      );

      if (newProduct) {
        onProductSelect({ id: newProduct.id, name: newProduct.name });
      }

      setShowCreateDialog(false);
      setPendingNewProduct('');
      setNewProductDescription('');
    } catch (error) {
      console.error('Error creating product purchase:', error);
    }
  };

  const handleClearSelection = () => {
    clearSelection();
    onProductSelect({ id: '', name: '' });
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <Label htmlFor="product_purchase_search" className="block text-sm font-medium mb-1">
        {label}
        {required && '*'}
      </Label>

      <div className="relative">
        <Input
          ref={inputRef}
          id="product_purchase_search"
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="h-10 mt-1 pr-10 bg-white text-gray-900 border-gray-300"
        />

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
          <Search className="h-4 w-4 text-gray-400" />
          {selectedProduct && (
            <button
              type="button"
              onClick={handleClearSelection}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => handleProductSelection(product)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                {product.isExisting ? (
                  <Package className="h-4 w-4 text-blue-500" />
                ) : (
                  <Plus className="h-4 w-4 text-green-500" />
                )}
                <div>
                  <div className="font-medium text-gray-900">{product.name}</div>
                  {product.description && (
                    <div className="text-sm text-gray-500">{product.description}</div>
                  )}
                </div>
              </div>

              {!product.isExisting && (
                <span className="text-xs text-green-600">Crear nuevo</span>
              )}
            </button>
          ))}
        </div>
      )}

      {selectedProduct && selectedProduct.description && (
        <div className="mt-2 p-2 bg-blue-50 rounded-md text-sm">
          <div className="font-medium text-blue-800">Descripción:</div>
          <div className="text-blue-700">{selectedProduct.description}</div>
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Crear nuevo producto comprado</h3>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <Label className="block text-sm font-medium mb-1">Nombre</Label>
                <Input type="text" value={pendingNewProduct} readOnly className="bg-gray-100" />
              </div>

              <div>
                <Label className="block text-sm font-medium mb-1">Descripción (opcional)</Label>
                <textarea
                  value={newProductDescription}
                  onChange={(e) => setNewProductDescription(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  rows={3}
                  placeholder="Descripción del producto..."
                />
              </div>
            </div>

            <div className="p-4 border-t flex justify-end space-x-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowCreateDialog(false);
                  setPendingNewProduct('');
                  setNewProductDescription('');
                }}
                disabled={isCreatingNew}
              >
                Cancelar
              </Button>

              <Button
                type="button"
                onClick={handleCreateWithDescription}
                disabled={isCreatingNew || !pendingNewProduct.trim()}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isCreatingNew ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear producto
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPurchasedSearchInput;
