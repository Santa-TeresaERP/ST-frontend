'use client';
import React from 'react';
import { X, Calendar, DollarSign, FileText, Clock } from 'lucide-react';

interface GeneralRegistry {
  id: number;
  name: string;
  date: string;
  amount: string;
  description: string;
  status: 'pending' | 'completed';
}

interface ModalViewGeneralRegistryProps {
  isOpen: boolean;
  onClose: () => void;
  registryData: GeneralRegistry | null;
}

const ModalViewGeneralRegistry: React.FC<ModalViewGeneralRegistryProps> = ({
  isOpen,
  onClose,
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-700 px-6 py-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-white">Detalle del Registro</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex justify-center">
            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(registryData.status)}`}>
              {formatStatus(registryData.status)}
            </span>
          </div>

          {/* Main Info Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FileText className="text-red-600" size={20} />
                <label className="text-sm font-medium text-gray-700">Nombre del Registro</label>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border">
                <p className="text-gray-900 font-medium">{registryData.name}</p>
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="text-red-600" size={20} />
                <label className="text-sm font-medium text-gray-700">Fecha</label>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border">
                <p className="text-gray-900">{registryData.date}</p>
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <DollarSign className="text-red-600" size={20} />
                <label className="text-sm font-medium text-gray-700">Monto Total</label>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border">
                <p className="text-gray-900 font-semibold text-lg">{registryData.amount}</p>
              </div>
            </div>

            {/* Status with icon */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="text-red-600" size={20} />
                <label className="text-sm font-medium text-gray-700">Estado</label>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(registryData.status)}`}>
                  {formatStatus(registryData.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Description - Full width */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <FileText className="text-red-600" size={20} />
              <label className="text-sm font-medium text-gray-700">Descripción</label>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-gray-900 leading-relaxed">{registryData.description}</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="text-blue-600" size={16} />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-900">Información Adicional</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Este registro contiene los gastos realizados durante el período especificado. 
                  {registryData.status === 'pending' 
                    ? ' Los datos están siendo procesados y serán actualizados próximamente.'
                    : ' Los datos han sido verificados y completados.'
                  }
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
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalViewGeneralRegistry;