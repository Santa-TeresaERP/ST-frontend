import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { createStoreSchema, CreateStoreFormData } from "../../schemas/store-schema";
import { useCreateStore } from "../../hook/useStores";

interface ModalCreateStoreProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ModalCreateStore: React.FC<ModalCreateStoreProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { mutate: createStore, isPending } = useCreateStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateStoreFormData>({
    resolver: zodResolver(createStoreSchema),
  });

  const onSubmit = (data: CreateStoreFormData) => {
    console.log('📝 Form data submitted:', data);
    console.log('🔄 Calling createStore mutation...');
    
    createStore(data, {
      onSuccess: (createdStore) => {
        console.log('✅ Store created successfully:', createdStore);
        toast.success("Tienda creada exitosamente");
        reset();
        onClose();
        onSuccess?.();
      },
      onError: (error) => {
        console.error('❌ Error creating store:', error);
        toast.error(error.message || "Error al crear la tienda");
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-xl -m-6 mb-6 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Crear Nueva Tienda</h2>
              <p className="text-blue-100 mt-1">Agrega una nueva tienda al sistema</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-blue-700 transition-colors duration-200 text-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre de la Tienda *
            </label>
            <input
              {...register("store_name")}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Tienda Centro"
            />
            {errors.store_name && (
              <p className="text-red-500 text-sm mt-1">{errors.store_name.message}</p>
            )}
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Dirección *
            </label>
            <input
              {...register("address")}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Av. Principal 123, Centro Histórico, Lima"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              {...register("observations")}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Observaciones adicionales sobre la tienda..."
            />
            {errors.observations && (
              <p className="text-red-500 text-sm mt-1">{errors.observations.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Creando..." : "Crear Tienda"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateStore;
