import React, { useState, useEffect } from "react";
import {
  FiX,
  FiDownload,
  FiBarChart,
  FiFilter,
  FiCalendar,
} from "react-icons/fi";
import { useFetchModules } from "../../../modules/hook/useModules";
import { exportVentasExcel } from "../..//action/exportVentasExcel";
import { exportRentalsExcel } from "../../action/exportRentalsExcel";
import { exportMonasteriosExcel } from "../../action/exportMonasterioExcel";
import { exportMuseoExcel } from "../../action/exportMuseoExcel";
interface ReporteData {
  id: number;
  modulo: string;
  fechaInicio: string;
  fechaFin?: string;
  observaciones?: string;
  ingresos: string;
  gastos: string;
  ganancia: string;
}

interface ModalInformeModuloProps {
  isOpen: boolean;
  onClose: () => void;
  reportes: ReporteData[];
  onExport: (modulo: string, datos: ReporteData[]) => void;
}

const ModalInformeModulo: React.FC<ModalInformeModuloProps> = ({
  isOpen,
  onClose,
  reportes,
  onExport,
}) => {
  const [selectedModulo, setSelectedModulo] = useState<string>("");
  const [filtrados, setFiltrados] = useState<ReporteData[]>([]);
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");

  // Obtener módulos desde la base de datos
  const { data: modules = [], isLoading: modulesLoading } = useFetchModules();

  useEffect(() => {
    let reportesFiltrados = reportes;

    // Filtrar por módulo
    if (selectedModulo) {
      reportesFiltrados = reportesFiltrados.filter(
        (r) => r.modulo === selectedModulo
      );
    }

    // Filtrar por fecha inicio
    if (fechaInicio) {
      reportesFiltrados = reportesFiltrados.filter((r) => {
        const fechaInicioReporte = new Date(r.fechaInicio);
        const fechaInicioFiltro = new Date(fechaInicio);
        return fechaInicioReporte >= fechaInicioFiltro;
      });
    }

    // Filtrar por fecha fin
    if (fechaFin) {
      reportesFiltrados = reportesFiltrados.filter((r) => {
        if (!r.fechaFin) return false; // Excluir reportes en proceso si hay filtro de fecha fin
        const fechaFinReporte = new Date(r.fechaFin);
        const fechaFinFiltro = new Date(fechaFin);
        return fechaFinReporte <= fechaFinFiltro;
      });
    }

    setFiltrados(reportesFiltrados);
  }, [selectedModulo, fechaInicio, fechaFin, reportes]);

  if (!isOpen) return null;

  // En lugar de usar módulos únicos de reportes, usar todos los módulos disponibles
  const modulosDisponibles = modules.map((module) => module.name);

  // Calcular totales
  const calcularTotales = () => {
    if (filtrados.length === 0) return { ingresos: 0, gastos: 0, ganancia: 0 };

    const totales = filtrados.reduce(
      (acc, reporte) => {
        const ingresos =
          parseFloat(reporte.ingresos.replace(/[^\d.-]/g, "")) || 0;
        const gastos = parseFloat(reporte.gastos.replace(/[^\d.-]/g, "")) || 0;
        const ganancia =
          parseFloat(reporte.ganancia.replace(/[^\d.-]/g, "")) || 0;

        return {
          ingresos: acc.ingresos + ingresos,
          gastos: acc.gastos + gastos,
          ganancia: acc.ganancia + ganancia,
        };
      },
      { ingresos: 0, gastos: 0, ganancia: 0 }
    );

    return totales;
  };

  const totales = calcularTotales();

  const getModuloIcon = (modulo: string) => {
    const moduloLower = modulo.toLowerCase();
    switch (moduloLower) {
      case "inventario":
      case "inventory":
        return "📦";
      case "producción":
      case "production":
        return "⚙️";
      case "ventas":
      case "sales":
        return "💼";
      case "finanzas":
      case "finance":
        return "💰";
      case "usuario":
      case "user":
      case "usuarios":
      case "users":
        return "👥";
      case "roles":
      case "role":
        return "🔐";
      case "alquileres":
      case "rentals":
      case "rental":
        return "🏠";
      case "museo":
      case "museum":
        return "🏛️";
      case "monasterio":
      case "monastery":
        return "⛪";
      default:
        return "📊";
    }
  };
  const handleExportExcel = async () => {
    try {
      if (!fechaInicio || !fechaFin) {
        alert("Selecciona un rango de fechas válido");
        return;
      }

      // Llamada al backend
      const blob = await exportVentasExcel(fechaInicio, fechaFin);

      // Crear enlace de descarga
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `reporte_ventas_${fechaInicio}_a_${fechaFin}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el Excel:", error);
      alert("Hubo un error al generar el Excel");
    }
  };
  const handleExportExcelRentals = async () => {
    try {
      if (!fechaInicio || !fechaFin) {
        alert("Selecciona un rango de fechas válido");
        return;
      }

      // Llamada al backend
      const blob = await exportRentalsExcel(fechaInicio, fechaFin);

      // Crear enlace de descarga
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `reporte_alquileres_${fechaInicio}_a_${fechaFin}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el Excel de alquileres:", error);
      alert("Hubo un error al generar el Excel de alquileres");
    }
  };
  const handleExportExcelMonasterios = async () => {
    try {
      if (!fechaInicio || !fechaFin) {
        alert("Selecciona un rango de fechas válido");
        return;
      }

      // Normalizar solo localmente (pero enviar en formato YYYY-MM-DD)
      const endDateObj = new Date(fechaFin);
      endDateObj.setHours(23, 59, 59, 999);

      const payload = {
        startDate: fechaInicio,
        endDate: fechaFin,
      };

      console.log("Payload enviado al backend (Monasterios):", payload);

      // Llamada al backend
      const blob = await exportMonasteriosExcel(
        payload.startDate,
        payload.endDate
      );

      // Crear enlace de descarga
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `reporte_monasterios_${fechaInicio}_a_${fechaFin}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el Excel de Monasterios:", error);
      alert("Hubo un error al generar el Excel de Monasterios");
    }
  };
  const handleExportExcelMuseo = async () => {
    try {
      if (!fechaInicio || !fechaFin) {
        alert("Selecciona un rango de fechas válido");
        return;
      }

      // Normalizar solo localmente (pero enviar en formato YYYY-MM-DD)
      const endDateObj = new Date(fechaFin);
      endDateObj.setHours(23, 59, 59, 999);

      const payload = {
        startDate: fechaInicio,
        endDate: fechaFin,
      };

      console.log("Payload enviado al backend (Museo):", payload);

      // Llamada al backend
      const blob = await exportMuseoExcel(payload.startDate, payload.endDate);

      // Crear enlace de descarga
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `reporte_museo_${fechaInicio}_a_${fechaFin}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el Excel de Museo:", error);
      alert("Hubo un error al generar el Excel de Museo");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-300">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10"></div>
          <div className="relative flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FiBarChart size={32} className="text-white/90" />
              <div>
                <h2 className="text-2xl font-bold mb-1">Informe por Módulo</h2>
                <p className="text-red-100 text-sm">
                  Análisis detallado de reportes por categoría
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Selector de módulo */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <FiFilter className="text-gray-600" />
                <label className="text-sm font-semibold text-gray-700">
                  Seleccionar Módulo
                </label>
              </div>
              <select
                value={selectedModulo}
                onChange={(e) => setSelectedModulo(e.target.value)}
                disabled={modulesLoading}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 hover:border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {modulesLoading
                    ? "Cargando módulos..."
                    : "-- Selecciona un módulo para analizar --"}
                </option>
                {modulosDisponibles.map((modulo: string) => (
                  <option key={modulo} value={modulo}>
                    {getModuloIcon(modulo)} {modulo}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtros de fecha */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <FiCalendar className="text-blue-600" />
                <label className="text-sm font-semibold text-gray-700">
                  Filtrar por Fechas
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 bg-white"
                  />
                </div>
              </div>
            </div>
            {/* 🚨 Bloque dinámico de botones según el módulo */}
            <div className="flex justify-center gap-4 mt-4">
              {["ventas", "inventario", "producción", "production"].includes(
                selectedModulo.toLowerCase()
              ) && (
                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-all"
                >
                  <FiDownload size={18} />
                  Obtener Excel de departamento de Ventas
                </button>
              )}

              {["alquileres", "rentals", "rental"].includes(
                selectedModulo.toLowerCase()
              ) && (
                <button
                  onClick={handleExportExcelRentals}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all"
                >
                  <FiDownload size={18} />
                  Obtener Excel de departamento de Alquileres
                </button>
              )}

              {["monasterio", "monasterios", "monastery"].includes(
                selectedModulo.toLowerCase()
              ) && (
                <button
                  onClick={handleExportExcelMonasterios}
                  className="flex items-center gap-2 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-md transition-all"
                >
                  <FiDownload size={18} />
                  Obtener Excel de departamento de Monasterios
                </button>
              )}
              {["museo", "museos", "museum"].includes(
                selectedModulo.toLowerCase()
              ) && (
                <button
                  onClick={handleExportExcelMuseo}
                  className="flex items-center gap-2 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition-all"
                >
                  <FiDownload size={18} />
                  Obtener Excel de departamento de Museo
                </button>
              )}
            </div>

            {/* Resumen de totales */}
            {selectedModulo && filtrados.length > 0 && (
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border border-red-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  {getModuloIcon(selectedModulo)} Resumen: {selectedModulo}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        💰 Ingresos Totales
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        ${totales.ingresos.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        💸 Gastos Totales
                      </span>
                      <span className="text-lg font-bold text-red-600">
                        ${totales.gastos.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-red-100">
                        📈 Ganancia Neta
                      </span>
                      <span className="text-lg font-bold">
                        ${totales.ganancia.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600 text-center">
                  📊 Basado en {filtrados.length} reporte
                  {filtrados.length !== 1 ? "s" : ""}
                </div>
              </div>
            )}

            {/* Tabla de historial */}
            {selectedModulo && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    📋 Historial Detallado: {selectedModulo}
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                          📅 Fecha Inicio
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                          🏁 Fecha Fin
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                          💰 Ingresos
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                          💸 Gastos
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                          📈 Ganancia
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                          📝 Observaciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filtrados.map((r, index) => (
                        <tr
                          key={r.id}
                          className={`hover:bg-gray-50 transition-colors duration-150 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {new Date(r.fechaInicio).toISOString().split('T')[0]}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {r.fechaFin ? new Date(r.fechaFin).toISOString().split('T')[0] : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                En proceso
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                            {r.ingresos}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                            {r.gastos}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                            {r.ganancia}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                            <div className="truncate" title={r.observaciones}>
                              {r.observaciones || (
                                <span className="text-gray-400 italic">
                                  Sin observaciones
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filtrados.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="text-4xl text-gray-300">📊</div>
                              <p className="text-gray-500">
                                No hay reportes disponibles para este módulo.
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Botón Exportar */}
            {selectedModulo && filtrados.length > 0 && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => onExport(selectedModulo, filtrados)}
                  className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FiDownload size={20} />
                  Exportar Informe PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalInformeModulo;
