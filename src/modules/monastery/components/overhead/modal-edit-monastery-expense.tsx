'use client';

import React from 'react';
import { X, AlertTriangle, Trash2, Shield, Info } from 'lucide-react';
import { Overhead } from '../../types/overheads';

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
  // Manejador para click en backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isPending) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-red-500 to-red-700 px-6 py-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Trash2 className="text-white" size={18} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Eliminar Gasto</h3>
                <p className="text-red-100 text-sm">Confirmar eliminación del registro</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              disabled={isPending}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200 disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Icono de advertencia central */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
              <AlertTriangle className="text-red-600" size={32} />
            </div>
          </div>

          {/* Mensaje principal */}
          <div className="text-center mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              ¿Confirmar eliminación?
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Estás a punto de eliminar el gasto{" "}
              <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                "{overheadName}"
              </span>
            </p>
          </div>

          {/* Información importante */}
          <div className="space-y-4 mb-6">
            {/* Información sobre eliminación suave */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Shield className="text-yellow-600 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <h5 className="text-sm font-medium text-yellow-900">Eliminación Segura</h5>
                  <p className="text-sm text-yellow-800 mt-1">
                    El registro será marcado como inactivo pero no se eliminará permanentemente de la base de datos.
                  </p>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <h5 className="text-sm font-medium text-blue-900">¿Qué sucederá?</h5>
                  <ul className="text-sm text-blue-800 mt-1 space-y-1">
                    <li>• El gasto desaparecerá de la lista principal</li>
                    <li>• Los datos quedarán guardados en el historial</li>
                    <li>• Un administrador puede restaurar el registro</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen del gasto */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
            <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Trash2 className="mr-2" size={14} />
              Gasto a eliminar:
            </h5>
            <div className="bg-white rounded-lg p-3 border">
              <p className="font-medium text-gray-900">{overheadName}</p>
              <p className="text-sm text-gray-500 mt-1">
                Esta acción se ejecutará inmediatamente
              </p>
            </div>
          </div>

          {/* Advertencia final */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-sm text-red-800">
                <strong>Importante:</strong> Aunque la eliminación es reversible, 
                recomendamos confirmar que realmente deseas proceder con esta acción.
              </p>
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl">
          <div className="flex justify-end items-center gap-3">
            <button
              onClick={onClose}
              disabled={isPending}
              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isPending}
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg"
            >
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Eliminando...</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>Sí, Eliminar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Indicador de procesamiento */}
        {isPending && (
          <div className="absolute top-0 right-0 w-3 h-3 bg-red-400 rounded-full transform translate-x-1 -translate-y-1 animate-ping"></div>
        )}
      </div>
    </div>
  );
};

export default ModalDeleteMonasteryExpense;