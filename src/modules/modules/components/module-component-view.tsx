"use client";
import React, { useState } from 'react';
import { useFetchModules, useUpdateModule } from '@/modules/modules/hook/useModules'; // Importar hooks necesarios
import { Card, CardContent, CardHeader, CardTitle } from '../../../app/components/ui/card';
import { Cuboid } from 'lucide-react';
import ModuleModal from './modal-update-module'; // Asegúrate de que la ruta sea correcta
import { Module } from '@/modules/modules/types/modules';

const ModuleList: React.FC = () => {
  const { data: modules, isLoading, error } = useFetchModules(); // Hook para obtener la lista de módulos
  const updateModuleMutation = useUpdateModule(); // Hook para actualizar un módulo
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const handleEditClick = (module: Module) => {
    console.log('Edit button clicked for module:', module);
    setSelectedModule(module);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('Modal closed');
    setIsModalOpen(false);
    setSelectedModule(null);
  };

  const handleUpdateModule = async (data: Omit<Module, 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('Actualizando módulo:', data);
      await updateModuleMutation.mutateAsync({ id: data.id, payload: { name: data.name, description: data.description } }); // Usar el hook para actualizar el módulo
      handleCloseModal();
    } catch (error) {
      console.error('Error updating module:', error);
    }
  };

  if (isLoading) {
    console.log('Loading modules...');
    return <div>Loading...</div>;
  }

  if (error) {
    console.error('Error fetching modules:', error);
    return <div>{error.message}</div>;
  }

  console.log('Modules fetched:', modules);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-red-800 border-b border-red-800 pb-2 mb-6">Gestión de Módulos</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules &&
          modules.map((module, index) => (
            <Card key={module.id || index} className="hover:shadow-lg border-gray-700 rounded-t-xl transition-shadow duration-300">
              <CardHeader className="bg-[#393939] rounded-t-xl">
                <CardTitle className="flex items-center text-red-700 ">
                  <Cuboid className="mr-2 h-5 w-5 text-red-500" />
                  <span className="text-white ">{module.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-gray-600 mb-1">
                  <strong className='text-red-800'>Descripción:</strong> {module.description}
                </p>
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(module);
                    }}
                  >
                    Editar
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
      {selectedModule && (
        <ModuleModal isOpen={isModalOpen} onClose={handleCloseModal} module={selectedModule} onSubmit={handleUpdateModule} />
      )}
    </div>
  );
};

export default ModuleList;