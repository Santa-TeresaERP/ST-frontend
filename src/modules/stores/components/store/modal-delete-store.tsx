import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { toast } from "react-toastify";
import { useDeleteStore } from "../../hook/useStores";

interface ModalDeleteStoreProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: string | null;
  storeName: string | null;
  onSuccess?: () => void;
}

const ModalDeleteStore: React.FC<ModalDeleteStoreProps> = ({
  isOpen,
  onClose,
  storeId,
  storeName,
  onSuccess
}) => {
  const { mutate: deleteStore, isPending } = useDeleteStore();

  const handleDelete = () => {
    if (!storeId) {
      toast.error("Error: No se puede identificar la tienda a eliminar");
      return;
    }

    deleteStore(storeId, {
      onSuccess: () => {
        toast.success(`La tienda "${storeName}" ha sido eliminada exitosamente`);
        onClose();
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message || "Error al eliminar la tienda");
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-red-600 to-red-800 rounded-t-xl -m-6 mb-6 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-white mr-3" />
              <div>
                <h2 className="text-xl font-bold text-white">Eliminar Tienda</h2>
                <p className="text-red-100 text-sm mt-1">Esta acción no se puede deshacer</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-red-700 transition-colors duration-200 text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¿Estás seguro de eliminar esta tienda?
            </h3>
            <p className="text-gray-600 mb-4">
              Se eliminará permanentemente la tienda:{" "}
              <span className="font-semibold text-gray-900">&ldquo;{storeName}&rdquo;</span>
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-semibold mb-1">Advertencia:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Esta acción eliminará permanentemente la tienda</li>
                    <li>Todos los datos relacionados se perderán</li>
                    <li>Las ventas asociadas podrían verse afectadas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDeleteStore;
