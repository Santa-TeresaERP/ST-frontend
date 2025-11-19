"use client";

import React from "react";
import { X, AlertTriangle, Trash2, Shield, Info } from "lucide-react";
import { Overhead } from "../../types/overheads";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  overheadName: string;
  overheadToEdit: Overhead | null;
}

const ModalDeleteMonasteryExpense: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  overheadName,
}) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isPending) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-2 sm:p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* contenedor del modal */}
      <div
        className="
        bg-white rounded-2xl shadow-2xl w-full sm:max-w-md md:max-w-lg 
        max-h-[90vh] overflow-y-auto 
        transform transition-all duration-300 scale-100
      "
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-700 px-3 sm:px-6 py-3 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Trash2 className="text-white" size={16} />
              </div>
              <div>
                <h3 className="text-base sm:text-xl font-bold text-white">
                  Eliminar Gasto
                </h3>
                <p className="text-red-100 text-xs sm:text-sm">
                  Confirmar eliminación del registro
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isPending}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 transition-all duration-200 disabled:opacity-50"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-3 sm:p-6">
          {/* Icono advertencia */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
              <AlertTriangle className="text-red-600" size={28} />
            </div>
          </div>

          {/* Mensaje principal */}
          <div className="text-center mb-4">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              ¿Confirmar eliminación?
            </h4>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Estás a punto de eliminar el gasto{" "}
              <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                &quot;{overheadName}&quot;
              </span>
            </p>
          </div>

          {/* Información importante */}
          <div className="space-y-3 mb-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
              <div className="flex items-start space-x-2">
                <Shield
                  className="text-yellow-600 flex-shrink-0 mt-0.5"
                  size={16}
                />
                <div>
                  <h5 className="text-xs sm:text-sm font-medium text-yellow-900">
                    Eliminación Segura
                  </h5>
                  <p className="text-xs sm:text-sm text-yellow-800 mt-1">
                    El registro será marcado como inactivo pero no se eliminará
                    permanentemente.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <div className="flex items-start space-x-2">
                <Info
                  className="text-blue-600 flex-shrink-0 mt-0.5"
                  size={16}
                />
                <div>
                  <h5 className="text-xs sm:text-sm font-medium text-blue-900">
                    ¿Qué sucederá?
                  </h5>
                  <ul className="text-xs sm:text-sm text-blue-800 mt-1 space-y-1">
                    <li>• El gasto desaparecerá de la lista principal</li>
                    <li>• Los datos quedarán guardados en el historial</li>
                    <li>• Un administrador puede restaurar el registro</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen del gasto */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-4">
            <h5 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Trash2 className="mr-1" size={12} />
              Gasto a eliminar:
            </h5>
            <div className="bg-white rounded-lg p-2 border">
              <p className="font-medium text-gray-900 text-sm sm:text-base">
                {overheadName}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Esta acción se ejecutará inmediatamente
              </p>
            </div>
          </div>

          {/* Advertencia final */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
            <div className="flex items-start space-x-1.5">
              <AlertTriangle
                className="text-red-600 flex-shrink-0 mt-0.5"
                size={14}
              />
              <p className="text-xs sm:text-sm text-red-800">
                <strong>Importante:</strong> Aunque la eliminación es
                reversible, confirma que realmente deseas proceder con esta
                acción.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 sm:px-6 py-3 rounded-b-2xl">
          <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-2">
            <button
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isPending}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 shadow-lg text-sm"
            >
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Eliminando...</span>
                </>
              ) : (
                <>
                  <Trash2 size={14} />
                  <span>Sí, Eliminar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {isPending && (
          <div className="absolute top-0 right-0 w-3 h-3 bg-red-400 rounded-full transform translate-x-1 -translate-y-1 animate-ping"></div>
        )}
      </div>
    </div>
  );
};

export default ModalDeleteMonasteryExpense;
