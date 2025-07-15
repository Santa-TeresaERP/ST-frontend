import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, X, Loader2, FileText } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { useResourceSearch, ResourceSearchResult } from '../../../hook/useResources';

interface ResourceSearchInputProps {
  label?: string;
  placeholder?: string;
  onResourceSelect: (resourceId: string) => void;
  className?: string;
  required?: boolean;
  error?: string;
}

const ResourceSearchInput: React.FC<ResourceSearchInputProps> = ({
  label = 'Recurso',
  placeholder = 'Buscar recurso...',
  onResourceSelect,
  className = '',
  required = false,
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newResourceDescription, setNewResourceDescription] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [pendingNewResource, setPendingNewResource] = useState<string>('');
  
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

  // Cerrar dropdown cuando se hace clic fuera
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

  // Manejar selección de recurso
  const handleResourceSelection = async (resource: ResourceSearchResult) => {
    if (resource.isExisting) {
      await handleSelectResource(resource);
      onResourceSelect(resource.id);
      setIsOpen(false);
    } else {
      // Para recursos nuevos, mostrar diálogo para descripción
      setPendingNewResource(resource.name);
      setShowCreateDialog(true);
      setIsOpen(false);
    }
  };

  // Crear nuevo recurso con descripción
  const handleCreateWithDescription = async () => {
    if (!pendingNewResource.trim()) return;
    
    try {
      const newResource = await handleCreateNewResource(pendingNewResource, newResourceDescription);
      if (newResource) {
        onResourceSelect(newResource.id);
      }
      setShowCreateDialog(false);
      setNewResourceDescription('');
      setPendingNewResource('');
    } catch (error) {
      console.error('Error creating resource:', error);
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
      <Label htmlFor="resource_search" className="block text-sm font-medium mb-1">
        {label}{required && '*'}
      </Label>
      
      <div className="relative">
        <Input
          ref={inputRef}
          id="resource_search"
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

      {/* Dropdown de sugerencias */}
      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((resource) => (
            <button
              key={resource.id}
              type="button"
              onClick={() => handleResourceSelection(resource)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                {resource.isExisting ? (
                  <FileText className="h-4 w-4 text-blue-500" />
                ) : (
                  <Plus className="h-4 w-4 text-green-500" />
                )}
                <div>
                  <div className="font-medium text-gray-900">
                    {resource.name}
                  </div>
                  {resource.observation && (
                    <div className="text-sm text-gray-500">
                      {resource.observation}
                    </div>
                  )}
                </div>
              </div>
              {!resource.isExisting && (
                <span className="text-xs text-green-600">
                  Crear nuevo
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Mostrar descripción del recurso seleccionado */}
      {selectedResource && selectedResource.observation && (
        <div className="mt-2 p-2 bg-blue-50 rounded-md text-sm">
          <div className="font-medium text-blue-800">
            Descripción:
          </div>
          <div className="text-blue-700 dark:text-blue-300">
            {selectedResource.observation}
          </div>
        </div>
      )}

      {/* Mostrar error */}
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}

      {/* Diálogo para crear nuevo recurso */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Crear Nuevo Recurso
              </h3>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <Label htmlFor="new_resource_name" className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Nombre del Recurso
                </Label>
                <Input
                  id="new_resource_name"
                  type="text"
                  value={pendingNewResource}
                  readOnly
                  className="bg-gray-100 dark:bg-gray-700"
                />
              </div>
              
              <div>
                <Label htmlFor="new_resource_description" className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Descripción (opcional)
                </Label>
                <textarea
                  id="new_resource_description"
                  value={newResourceDescription}
                  onChange={(e) => setNewResourceDescription(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Descripción del recurso..."
                />
              </div>
            </div>
            
            <div className="p-4 border-t dark:border-gray-700 flex justify-end space-x-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowCreateDialog(false);
                  setNewResourceDescription('');
                  setPendingNewResource('');
                }}
                disabled={isCreatingNew}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleCreateWithDescription}
                disabled={isCreatingNew || !pendingNewResource.trim()}
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
                    Crear Recurso
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
