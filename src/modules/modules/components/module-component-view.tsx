"use client";
import React, { useState } from 'react';
import { useFetchModules, useUpdateModule } from '@/modules/modules/hook/useModules';
import { Card, CardContent, CardHeader, CardTitle } from '../../../app/components/ui/card';
import { Cuboid, LayoutDashboard } from 'lucide-react';
import ModuleModal from './modal-update-module';
import { Module } from '@/modules/modules/types/modules';

const ModuleList: React.FC = () => {
  const { data: modules, isLoading, error } = useFetchModules();
  const updateModuleMutation = useUpdateModule();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const handleEditClick = (module: Module) => {
    setSelectedModule(module);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedModule(null);
  };

  const handleUpdateModule = async (data: Omit<Module, 'createdAt' | 'updatedAt'>) => {
    try {
      await updateModuleMutation.mutateAsync({
        id: data.id,
        payload: {
          name: data.name,
          description: data.description,
        },
      });
      handleCloseModal();
    } catch (error) {
      console.error('Error updating module:', error);
    }
  };

  if (isLoading) return <div className="text-center text-red-800 font-semibold">Cargando módulos...</div>;
  if (error) return <div className="text-center text-red-800 font-semibold">{error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3 p-4">
          <Cuboid className="w-7 h-7 sm:w-8 sm:h-8 text-red-600" />
          Gestión de Módulos
        </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules?.map((module, index) => (
          <Card
            key={module.id || index}
            className="rounded-xl overflow-hidden shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <CardHeader className="bg-red-700 text-white rounded-t-xl px-4 py-3">
              <CardTitle className="flex items-center gap-2">
                <Cuboid className="text-white w-5 h-5" />
                <span className="text-lg font-semibold">{module.name}</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="bg-white px-4 py-5">
              <p className="text-gray-700 text-sm mb-2">
                <span className="font-semibold text-green-700">Descripción:</span> {module.description}
              </p>

              <div className="flex justify-end mt-4">
                <button
                  className="bg-red-700 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-3xl transition-colors"
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
        <ModuleModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          module={selectedModule}
          onSubmit={handleUpdateModule}
        />
      )}
    </div>
  );
};

export default ModuleList;
