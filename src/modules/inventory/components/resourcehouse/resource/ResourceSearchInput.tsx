import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, X, Loader2, FileText } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { useResourceSearch, ResourceSearchResult } from '../../../hook/useResources';

interface ResourceSearchInputProps {
  label?: string;
  placeholder?: string;
  onResourceSelect: (purchaseId: string) => void;
  className?: string;
  required?: boolean;
  error?: string;
}

const ResourceSearchInput: React.FC<ResourceSearchInputProps> = ({
  label = 'Compra',
  placeholder = 'Buscar compra...',
  onResourceSelect,
  className = '',
  required = false,
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newPurchaseDescription, setNewPurchaseDescription] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [pendingNewPurchase, setPendingNewPurchase] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    searchTerm,
    setSearchTerm,
    suggestions,
    selectedResource,
    isLoading,
    isCreatingNew,
    handleSelectResource,
    handleCreateNewResource,
    clearSelection
  } = useResourceSearch();

  // Cerrar dropdown cuando clic fuera
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

  // Selección de compra
  const handlePurchaseSelection = async (purchase: ResourceSearchResult) => {
    if (purchase.isExisting) {
      await handleSelectResource(purchase);
      onResourceSelect(purchase.id);
      setIsOpen(false);
    } else {
      setPendingNewPurchase(purchase.name);
      setShowCreateDialog(true);
      setIsOpen(false);
    }
  };

  // Crear compra con descripción
  const handleCreateWithDescription = async () => {
    if (!pendingNewPurchase.trim()) return;

    try {
      const newPurchase = await handleCreateNewResource(
        pendingNewPurchase,
        newPurchaseDescription
      );

      if (newPurchase) {
        onResourceSelect(newPurchase.id);
      }

      setShowCreateDialog(false);
      setNewPurchaseDescription('');
      setPendingNewPurchase('');
    } catch (error) {
      console.error('Error creating purchase:', error);
    }
  };

  // Limpiar selección
  const handleClearSelection = () => {
    clearSelection();
    onResourceSelect('');
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <Label htmlFor="purchase_search" className="block text-sm font-medium mb-1">
        {label}{required && '*'}
      </Label>

      <div className="relative">
        <Input
          ref={inputRef}
          id="purchase_search"
          type="text"
          value={searchTerm || ''}
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
          {selectedResource && (
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

      {/* Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((purchase) => (
            <button
              key={purchase.id}
              type="button"
              onClick={() => handlePurchaseSelection(purchase)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                {purchase.isExisting ? (
                  <FileText className="h-4 w-4 text-blue-500" />
                ) : (
                  <Plus className="h-4 w-4 text-green-500" />
                )}
                <div>
                  <div className="font-medium text-gray-900">
                    {purchase.name}
                  </div>
                  {purchase.observation && (
                    <div className="text-sm text-gray-500">
                      {purchase.observation}
                    </div>
                  )}
                </div>
              </div>

              {!purchase.isExisting && (
                <span className="text-xs text-green-600">Crear nuevo</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Descripción */}
      {selectedResource && selectedResource.observation && (
        <div className="mt-2 p-2 bg-blue-50 rounded-md text-sm">
          <div className="font-medium text-blue-800">Descripción:</div>
          <div className="text-blue-700">{selectedResource.observation}</div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}

      {/* Modal Crear Compra */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Crear Nueva Compra
              </h3>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <Label className="block text-sm font-medium mb-1">
                  Nombre de la Compra
                </Label>
                <Input
                  type="text"
                  value={pendingNewPurchase}
                  readOnly
                  className="bg-gray-100"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium mb-1">
                  Descripción (opcional)
                </Label>
                <textarea
                  value={newPurchaseDescription}
                  onChange={(e) => setNewPurchaseDescription(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  rows={3}
                  placeholder="Descripción de la compra..."
                />
              </div>
            </div>

            <div className="p-4 border-t flex justify-end space-x-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowCreateDialog(false);
                  setNewPurchaseDescription('');
                  setPendingNewPurchase('');
                }}
                disabled={isCreatingNew}
              >
                Cancelar
              </Button>

              <Button
                type="button"
                onClick={handleCreateWithDescription}
                disabled={isCreatingNew || !pendingNewPurchase.trim()}
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
                    Crear Compra
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

export default ResourceSearchInput;
