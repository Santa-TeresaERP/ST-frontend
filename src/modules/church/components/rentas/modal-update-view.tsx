'use client';

import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Tag, Save, Clock, Edit } from 'lucide-react';

// Tipos (puedes importarlos de un archivo central si los tienes)
interface Reserva {
  id: number;
  nombre: string;
  precio: number;
  tipo: string;
  fecha: string;
  tiempoInicio: string;
  tiempoFin: string;
}

interface ReservaFormData {
  nombre: string;
  precio: string;
  tipo: string;
  fecha: string;
  tiempoInicio: string;
  tiempoFin: string;
}

interface ModalEditReservaProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (id: number, data: ReservaFormData) => void;
  reservaToEdit: Reserva | null;
}

const ModalEditReserva: React.FC<ModalEditReservaProps> = ({ 
  isOpen, 
  onClose,
  onSubmit,
  reservaToEdit 
}) => {
  const [formData, setFormData] = useState<ReservaFormData>({
    nombre: '',
    precio: '',
    tipo: '',
    fecha: '',
    tiempoInicio: '',
    tiempoFin: ''
  });

  const [errors, setErrors] = useState<Partial<ReservaFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tipos predefinidos de reservas
  const tiposReservas = [
    'Bautizo',
    'Matrimonio',
    'Misa Especial',
    'Confirmación',
    'Evento Parroquial',
    'Otro'
  ];

  // Cargar datos cuando se abre el modal o cambia reservaToEdit
  useEffect(() => {
    if (reservaToEdit && isOpen) {
      setFormData({
        nombre: reservaToEdit.nombre,
        precio: reservaToEdit.precio.toString(),
        tipo: reservaToEdit.tipo,
        fecha: reservaToEdit.fecha,
        tiempoInicio: reservaToEdit.tiempoInicio,
        tiempoFin: reservaToEdit.tiempoFin
      });
      setErrors({});
    }
  }, [reservaToEdit, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo
    if (errors[name as keyof ReservaFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ReservaFormData> = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.precio || Number(formData.precio) <= 0) newErrors.precio = 'El precio debe ser mayor a 0';
    if (!formData.tipo) newErrors.tipo = 'El tipo es requerido';
    if (!formData.fecha) newErrors.fecha = 'La fecha es requerida';
    if (!formData.tiempoInicio) newErrors.tiempoInicio = 'La hora de inicio es requerida';
    if (!formData.tiempoFin) newErrors.tiempoFin = 'La hora de fin es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !reservaToEdit) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Llamar a la función onSubmit si existe
      if (onSubmit) {
        onSubmit(reservaToEdit.id, formData);
      }

      console.log('Reserva actualizada:', { id: reservaToEdit.id, ...formData });

      // Cerrar modal
      onClose();
    } catch (error) {
      console.error('Error al actualizar reserva:', error);
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slideUp">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Edit className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Editar Evento
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
          {/* ID Info */}
          {reservaToEdit && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2 mb-5">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-blue-700 font-medium">
                Editando evento ID: <span className="font-bold">#{reservaToEdit.id}</span>
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            
            {/* Columna Izquierda */}
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre del Evento *
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
                placeholder="Ej: Bautizo de..."
                disabled={isSubmitting}
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
              )}
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de Evento *
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
                  {tiposReservas.map(tipo => (
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

            {/* Hora de Inicio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hora de Inicio *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="time"
                  name="tiempoInicio"
                  value={formData.tiempoInicio}
                  onChange={handleChange}
                  className={`
                    w-full pl-10 pr-4 py-3 border rounded-lg
                    focus:ring-2 focus:ring-red-500 focus:border-transparent
                    transition-all duration-200
                    ${errors.tiempoInicio ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                  `}
                  disabled={isSubmitting}
                />
              </div>
              {errors.tiempoInicio && (
                <p className="mt-1 text-sm text-red-600">{errors.tiempoInicio}</p>
              )}
            </div>
            
            {/* Columna Derecha */}
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

            {/* Precio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Precio (S/.) *
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

            {/* Hora de Fin */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hora de Fin *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="time"
                  name="tiempoFin"
                  value={formData.tiempoFin}
                  onChange={handleChange}
                  className={`
                    w-full pl-10 pr-4 py-3 border rounded-lg
                    focus:ring-2 focus:ring-red-500 focus:border-transparent
                    transition-all duration-200
                    ${errors.tiempoFin ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                  `}
                  disabled={isSubmitting}
                />
              </div>
              {errors.tiempoFin && (
                <p className="mt-1 text-sm text-red-600">{errors.tiempoFin}</p>
              )}
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
                Actualizar Evento
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default ModalEditReserva;