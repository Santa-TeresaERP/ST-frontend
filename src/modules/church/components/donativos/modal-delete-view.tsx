'use client';

import React, { useState, useEffect } from 'react'; // Agregamos useEffect por si acaso
import { X, Trash2, AlertTriangle } from 'lucide-react';

// INTERFAZ ACTUALIZADA: Coincide con tu Backend (inglés)
interface DonativoData {
  id: string | number;
  name: string;   // DB column: name
  price: number;  // DB column: price
  type: string;   // DB column: type
  date: string;   // DB column: date
}

interface ModalDeleteDonativoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void; 
  isPending?: boolean; // Estado de carga que viene del hook principal
  donativoData: DonativoData | null;
}

const ModalDeleteDonativo: React.FC<ModalDeleteDonativoProps> = ({ 
  isOpen, 
  onClose,
  onConfirm,
  isPending: externalPending = false,
  donativoData
}) => {
  const [isInternalDeleting, setIsInternalDeleting] = useState(false);

  // El modal está cargando si el hook externo dice que carga O si estamos procesando internamente
  const isLoading = externalPending || isInternalDeleting;

  // Reseteamos el estado interno cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) setIsInternalDeleting(false);
  }, [isOpen]);

  const handleConfirm = async () => {
    if (isLoading) return;
    
    setIsInternalDeleting(true);
    try {
      // Esperamos a que el padre (ChurchComponentView) termine su lógica
      await onConfirm();
      // NOTA: No cerramos aquí, el padre cerrará el modal si tuvo éxito
    } catch (error) {
      console.error("Error al eliminar en el modal:", error);
      setIsInternalDeleting(false); // Si falló, dejamos de cargar para permitir reintentar
    }
  };

  const handleClose = () => {
    if (!isLoading) {
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
            disabled={isLoading}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 mb-1">
                ¿Estás seguro?
              </h3>
              <p className="text-sm text-red-700">
                Se eliminará el registro permanentemente de la base de datos.
              </p>
            </div>
          </div>

          {/* Detalles del item a eliminar */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                 <p className="text-xs text-gray-500 mb-1">Monto</p>
                 {/* Asegúrate de que donativoData.price existe y es numero */}
                 <p className="font-bold text-red-700 text-lg">
                   S/. {Number(donativoData.price || 0).toFixed(2)}
                 </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Fecha</p>
                <p className="text-sm text-gray-700 font-medium">
                  {donativoData.date ? new Date(donativoData.date).toLocaleDateString('es-PE') : '-'}
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-3">
              <p className="text-xs text-gray-500 mb-1">Concepto / Nombre</p>
              <p className="font-semibold text-gray-800">{donativoData.name}</p>
            </div>
            
            <div className="pt-1">
               <span className="inline-block px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-md">
                 {donativoData.type}
               </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 font-medium shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Eliminar
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Estilos para animación simple */}
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default ModalDeleteDonativo;