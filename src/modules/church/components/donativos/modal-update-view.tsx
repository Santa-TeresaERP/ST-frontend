'use client';

import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Tag, FileText, Save, Edit } from 'lucide-react';

interface ModalEditDonativoProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (id: number, data: DonativoFormData) => void;
  donativoToEdit: Donativo | null;
}

interface Donativo {
  id: number;
  nombre: string;
  precio: number;
  tipo: string;
  fecha: string;
  descripcion?: string;
}

interface DonativoFormData {
  nombre: string;
  precio: string;
  tipo: string;
  fecha: string;
  descripcion: string;
}

const ModalEditDonativo: React.FC<ModalEditDonativoProps> = ({ 
  isOpen, 
  onClose,
  onSubmit,
  donativoToEdit 
}) => {
  const [formData, setFormData] = useState<DonativoFormData>({
    nombre: '',
    precio: '',
    tipo: '',
    fecha: '',
    descripcion: ''
  });

  const [errors, setErrors] = useState<Partial<DonativoFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tipos predefinidos de donativos
  const tiposDonativos = [
    'Limosna yape',
    'Limosna efectivo',
    'Donativo',
    'Ofrenda',
    'Diezmo',
    'Otro'
  ];

  // Cargar datos cuando se abre el modal o cambia donativoToEdit
  useEffect(() => {
    if (donativoToEdit && isOpen) {
      setFormData({
        nombre: donativoToEdit.nombre,
        precio: donativoToEdit.precio.toString(),
        tipo: donativoToEdit.tipo,
        fecha: donativoToEdit.fecha,
        descripcion: donativoToEdit.descripcion || ''
      });
      setErrors({});
    }
  }, [donativoToEdit, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name as keyof DonativoFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<DonativoFormData> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.precio || Number(formData.precio) <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    if (!formData.tipo) {
      newErrors.tipo = 'El tipo es requerido';
    }

    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !donativoToEdit) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Llamar a la función onSubmit si existe
      if (onSubmit) {
        onSubmit(donativoToEdit.id, formData);
      }

      console.log('Donativo actualizado:', { id: donativoToEdit.id, ...formData });

      // Cerrar modal
      onClose();
    } catch (error) {
      console.error('Error al actualizar donativo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slideUp">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Edit className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Editar Donativo
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors duration-200 disabled:opacity-50"
            title="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-5">
            
            {/* ID Info */}
            {donativoToEdit && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm text-blue-700 font-medium">
                  Editando donativo ID: <span className="font-bold">#{donativoToEdit.id}</span>
                </p>
              </div>
            )}

            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre del Donativo *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`
                  w-full px-4 py-3 border rounded-lg
                  focus:ring-2 focus:ring-red-500 focus:border-transparent
                  transition-all duration-200
                  ${errors.nombre ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                `}
                placeholder="Ej: Limosna, Donativo, Ofrenda..."
                disabled={isSubmitting}
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
              )}
            </div>

            {/* Precio y Tipo en Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Precio */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Monto (S/.) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`
                      w-full pl-10 pr-4 py-3 border rounded-lg
                      focus:ring-2 focus:ring-red-500 focus:border-transparent
                      transition-all duration-200
                      ${errors.precio ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                    `}
                    placeholder="0.00"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.precio && (
                  <p className="mt-1 text-sm text-red-600">{errors.precio}</p>
                )}
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Donativo *
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className={`
                      w-full pl-10 pr-4 py-3 border rounded-lg
                      focus:ring-2 focus:ring-red-500 focus:border-transparent
                      transition-all duration-200
                      appearance-none cursor-pointer
                      ${errors.tipo ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                    `}
                    disabled={isSubmitting}
                  >
                    <option value="">Seleccionar tipo...</option>
                    {tiposDonativos.map(tipo => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.tipo && (
                  <p className="mt-1 text-sm text-red-600">{errors.tipo}</p>
                )}
              </div>
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fecha *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  className={`
                    w-full pl-10 pr-4 py-3 border rounded-lg
                    focus:ring-2 focus:ring-red-500 focus:border-transparent
                    transition-all duration-200
                    ${errors.fecha ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                  `}
                  disabled={isSubmitting}
                />
              </div>
              {errors.fecha && (
                <p className="mt-1 text-sm text-red-600">{errors.fecha}</p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción (Opcional)
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Escribe detalles adicionales sobre el donativo..."
                  disabled={isSubmitting}
                />
              </div>
            </div>

          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Actualizando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Actualizar Donativo
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

export default ModalEditDonativo;