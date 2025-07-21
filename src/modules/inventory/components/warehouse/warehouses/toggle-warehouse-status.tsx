import { useDeleteWarehouse } from "@/modules/inventory/hook/useWarehouses";
import { WarehouseAttributes } from "@/modules/inventory/types/warehouse";
import { Power, PowerOff } from "lucide-react";
import { toast } from "react-toastify";

interface ToggleWarehouseStatusProps {
  warehouse: WarehouseAttributes;
}

const ToggleWarehouseStatus: React.FC<ToggleWarehouseStatusProps> = ({ warehouse }) => {
  const { mutate: toggleWarehouseStatus, isPending } = useDeleteWarehouse(); // Renombrado para claridad

  const handleToggleStatus = () => {
    if (!warehouse.id) {
      toast.error("Error: No se puede identificar el almacén.");
      return;
    }

    toggleWarehouseStatus({ id: warehouse.id, status: !warehouse.status }, {
      onSuccess: () => {
        toast.success(`El almacén "${warehouse.name}" ha sido ${warehouse.status ? 'desactivado' : 'activado'} exitosamente.`);
      },
      onError: (error: unknown) => {
        toast.error("No se pudo cambiar el estado del almacén.");
        console.error("Error al cambiar estado:", error);
      },
    });
  };

  return (
    <button
      onClick={handleToggleStatus}
      disabled={isPending}
      className={`p-2 rounded-lg transition-colors duration-200 ${
        warehouse.status
          ? "text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100"
          : "text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100"
      } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
      title={warehouse.status ? "Desactivar almacén" : "Activar almacén"}
    >
      {isPending ? (
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