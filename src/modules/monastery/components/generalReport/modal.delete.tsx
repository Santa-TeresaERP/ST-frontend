'use client';
import React from 'react';
import { X, AlertTriangle, Trash2, Calendar, FileText } from 'lucide-react';

interface GeneralRegistry {
  id: number;
  name: string;
  date: string;
  amount: string;
  description: string;
  status: 'pending' | 'completed';
}

interface ModalDeleteGeneralRegistryProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  registryData: GeneralRegistry | null;
}

const ModalDeleteGeneralRegistry: React.FC<ModalDeleteGeneralRegistryProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  registryData
}) => {
  if (!isOpen || !registryData) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatStatus = (status: string) => {
    return status === 'pending' ? 'En Proceso' : 'Completado';
  };

  const getStatusColor = (status: string) => {
    return status === 'pending' 
      ? 'bg-yellow-100 text-yellow-800 border-yellow-300' 
      : 'bg-green-100 text-green-800 border-green-300';
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-700 px-6 py-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Trash2 className="text-white" size={24} />
              <h2 className="text-xl font-semibold text-white">Eliminar Registro</h2>
            </div>
            <button
              onClick={onClose}
              disabled={isPending}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors duration-200 disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="text-red-600" size={32} />
            </div>
          </div>

          {/* Warning Message */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¿Estás seguro de eliminar este registro?
            </h3>
            <p className="text-gray-600">
              Esta acción no se puede deshacer. Se eliminará permanentemente el registro y toda la información asociada.
            </p>
          </div>

          {/* Registry Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <div className="space-y-3">
              {/* Name */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="text-gray-500" size={16} />
                  <span className="text-sm font-medium text-gray-700">Nombre:</span>
                </div>
                <span className="text-sm text-gray-900 font-medium">{registryData.name}</span>
              </div>

              {/* Date */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="text-gray-500" size={16} />
                  <span className="text-sm font-medium text-gray-700">Fecha:</span>
                </div>
                <span className="text-sm text-gray-900">{registryData.date}</span>
              </div>

              {/* Amount */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Monto:</span>
                <span className="text-sm text-gray-900 font-semibold">{registryData.amount}</span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Estado:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(registryData.status)}`}>
                  {formatStatus(registryData.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={16} />
              <div>
                <p className="text-sm text-yellow-800">
                  <strong>Advertencia:</strong> Al eliminar este registro se perderán todos los gastos asociados al período {registryData.name.toLowerCase()}.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isPending}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium disabled:opacity-50 flex items-center space-x-2"
            >
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Eliminando...</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>Eliminar Registro</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDeleteGeneralRegistry;