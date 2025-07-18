import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { updateStoreSchema, UpdateStoreFormData } from "../../schemas/store-schema";
import { useUpdateStore } from "../../hook/useStores";
import { StoreAttributes } from "../../types/store";

interface ModalEditStoreProps {
  isOpen: boolean;
  onClose: () => void;
  store: StoreAttributes | null;
  onSuccess?: () => void;
}

const ModalEditStore: React.FC<ModalEditStoreProps> = ({
  isOpen,
  onClose,
  store,
  onSuccess
}) => {
  const { mutate: updateStore, isPending } = useUpdateStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdateStoreFormData>({
    resolver: zodResolver(updateStoreSchema),
  });

  // Cargar datos de la tienda cuando se abre el modal
  useEffect(() => {
    if (store && isOpen) {
      setValue("id", store.id!);
      setValue("store_name", store.store_name);
      setValue("address", store.address);
      setValue("observations", store.observations || "");
    }
  }, [store, isOpen, setValue]);

  const onSubmit = (data: UpdateStoreFormData) => {
    if (!store?.id) {
      toast.error("Error: No se puede identificar la tienda a editar");
      return;
    }

    updateStore(data, {
      onSuccess: () => {
        toast.success("Tienda actualizada exitosamente");
        reset();
        onClose();
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message || "Error al actualizar la tienda");
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen || !store) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-green-600 to-green-800 rounded-t-xl -m-6 mb-6 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Editar Tienda</h2>
              <p className="text-green-100 mt-1">Modifica la información de {store.store_name}</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-green-700 transition-colors duration-200 text-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ID oculto */}
          <input {...register("id")} type="hidden" />

          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre de la Tienda *
            </label>
            <input
              {...register("store_name")}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
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
              className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Actualizando..." : "Actualizar Tienda"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditStore;
