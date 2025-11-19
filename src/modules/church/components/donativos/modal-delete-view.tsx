'use client';

import React from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';

interface ModalDeleteDonativoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
  donativoData: {
    id: number;
    nombre: string;
    precio: number;
    tipo: string;
    fecha: string;
  } | null;
}

const ModalDeleteDonativo: React.FC<ModalDeleteDonativoProps> = ({ 
  isOpen, 
  onClose,
  onConfirm,
  isPending = false,
  donativoData
}) => {
  
  const handleConfirm = () => {
    if (!isPending) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (!isPending) {
      onClose();
    }
  };

  if (!isOpen || !donativoData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Trash2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Eliminar Donativo
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isPending}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Warning Alert */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 mb-1">
                ¿Estás seguro de eliminar este donativo?
              </h3>
              <p className="text-sm text-red-700">
                Esta acción no se puede deshacer. El registro será eliminado permanentemente.
              </p>
            </div>
          </div>

          {/* Donativo Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Detalles del Donativo
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">ID</p>
                <p className="font-bold text-gray-800">#{donativoData.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Monto</p>
                <p className="font-bold text-red-700">S/. {donativoData.precio.toFixed(2)}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3">
              <p className="text-xs text-gray-500 mb-1">Nombre</p>
              <p className="font-semibold text-gray-800">{donativoData.nombre}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-gray-200 pt-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Tipo</p>
                <p className="text-sm text-gray-700">{donativoData.tipo}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Fecha</p>
                <p className="text-sm text-gray-700">
                  {new Date(donativoData.fecha).toLocaleDateString('es-PE')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={handleClose}
            disabled={isPending}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5" />
                Eliminar Donativo
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ModalDeleteDonativo;