import React from "react";
import { Power, PowerOff } from "lucide-react";
import { useDeleteWarehouse, useActivateWarehouse } from "@/modules/inventory/hook/useWarehouses";
import { toast } from 'react-toastify';

interface WarehouseAttributes {
  id?: string;
  name: string;
  location: string;
  capacity?: number;
  status: boolean;
  observation?: string;
}

interface ToggleWarehouseStatusProps {
  warehouse: WarehouseAttributes;
}

const ToggleWarehouseStatus: React.FC<ToggleWarehouseStatusProps> = ({ warehouse }) => {
  const { mutate: deleteWarehouse, isPending: isDeleting } = useDeleteWarehouse();
  const { mutate: activateWarehouse, isPending: isActivating } = useActivateWarehouse();

  const handleToggleStatus = () => {
    if (!warehouse.id) {
      toast.error("Error: No se puede identificar el almacén.");
      return;
    }

    if (warehouse.status) {
      // Si está activo, lo desactivamos (eliminamos lógicamente)
      deleteWarehouse(warehouse.id, {
        onSuccess: () => {
          toast.success(`El almacén "${warehouse.name}" ha sido desactivado exitosamente.`);
        },
        onError: (error) => {
          toast.error("No se pudo desactivar el almacén. Inténtalo de nuevo.");
          console.error("Error al desactivar almacén:", error);
        },
      });
    } else {
      // Si está inactivo, lo activamos
      activateWarehouse(warehouse.id, {
        onSuccess: () => {
          toast.success(`El almacén "${warehouse.name}" ha sido activado exitosamente.`);
        },
        onError: (error) => {
          toast.error("No se pudo activar el almacén. Inténtalo de nuevo.");
          console.error("Error al activar almacén:", error);
        },
      });
    }
  };

  return (
    <button
      onClick={handleToggleStatus}
      disabled={isDeleting || isActivating}
      className={`p-2 rounded-lg transition-colors duration-200 ${
        warehouse.status
          ? "text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100"
          : "text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100"
      } ${isDeleting || isActivating ? "opacity-50 cursor-not-allowed" : ""}`}
      title={warehouse.status ? "Desactivar almacén" : "Activar almacén"}
    >
      {isDeleting || isActivating ? (
        <span className="w-5 h-5 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
      ) : warehouse.status ? (
        <Power size={20} />
      ) : (
        <PowerOff size={20} />
      )}
    </button>
  );
};

export default ToggleWarehouseStatus;