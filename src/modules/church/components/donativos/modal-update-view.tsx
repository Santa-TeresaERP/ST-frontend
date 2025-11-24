'use client';

import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Tag , Save, Edit } from 'lucide-react';

// INTERFAZ 1: Los datos que vienen del Backend (Inglés)
interface IncomeChurchData {
  id: string | number;
  name: string;
  price: number;
  type: string;
  date: string;
  status?: boolean;
}

// INTERFAZ 2: Los datos del formulario interno (Español)
interface DonativoFormData {
  nombre: string;
  precio: string;
  tipo: string;
  fecha: string;
  descripcion: string;
}

interface ModalEditDonativoProps {
  isOpen: boolean;
  onClose: () => void;
  // Cambiamos el tipo de retorno a Promise para manejar el loading
  onSubmit: (id: string | number, data: DonativoFormData) => Promise<void> | void;
  donativoToEdit: IncomeChurchData | null;
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

  const tiposDonativos = [
    'Limosna yape',
    'Limosna efectivo',
    'Donativo',
    'Ofrenda',
    'Diezmo',
    'Otro'
  ];

  // EFECTO: Cargar datos y MAPEAR (Inglés -> Español)
  useEffect(() => {
    if (donativoToEdit && isOpen) {
      // Formatear fecha para el input type="date" (YYYY-MM-DD)
      // La BD suele devolver ISO completo (2023-11-21T10:30...)
      let formattedDate = '';
      if (donativoToEdit.date) {
        formattedDate = new Date(donativoToEdit.date).toISOString().split('T')[0];
      }

      setFormData({
        nombre: donativoToEdit.name,             // name -> nombre
        precio: donativoToEdit.price.toString(), // price -> precio
        tipo: donativoToEdit.type,               // type -> tipo
        fecha: formattedDate,                    // date -> fecha
        descripcion: '' // Tu backend no devolvió descripción en el JSON, lo dejamos vacío
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
    
    if (errors[name as keyof DonativoFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<DonativoFormData> = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.precio || Number(formData.precio) <= 0) newErrors.precio = 'El precio debe ser mayor a 0';
    if (!formData.tipo) newErrors.tipo = 'El tipo es requerido';
    if (!formData.fecha) newErrors.fecha = 'La fecha es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !donativoToEdit) return;

    setIsSubmitting(true);

    try {
      // AQUÍ ESTÁ EL CAMBIO IMPORTANTE:
      // Eliminamos el setTimeout y esperamos a la función real del padre
      await onSubmit(donativoToEdit.id, formData);
      
      // Si todo sale bien, cerramos
      onClose();
    } catch (error) {
      console.error('Error al actualizar donativo:', error);
      // Aquí podrías setear un error global si quisieras
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
            <h2 className="text-2xl font-bold text-white">Editar Donativo</h2>
          </div>
          <button onClick={handleClose} disabled={isSubmitting} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
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
                  ID: <span className="font-bold">#{String(donativoToEdit.id).substring(0, 8)}...</span>
                </p>
              </div>
            )}

            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Donativo *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${errors.nombre ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                placeholder="Ej: Limosna..."
                disabled={isSubmitting}
              />
              {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
            </div>

            {/* Grid Precio y Tipo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Monto (S/.) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    step="0.01"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${errors.precio ? 'border-red-500' : 'border-gray-300'}`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.precio && <p className="mt-1 text-sm text-red-600">{errors.precio}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo *</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${errors.tipo ? 'border-red-500' : 'border-gray-300'}`}
                    disabled={isSubmitting}
                  >
                    <option value="">Seleccionar...</option>
                    {tiposDonativos.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                {errors.tipo && <p className="mt-1 text-sm text-red-600">{errors.tipo}</p>}
              </div>
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${errors.fecha ? 'border-red-500' : 'border-gray-300'}`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.fecha && <p className="mt-1 text-sm text-red-600">{errors.fecha}</p>}
            </div>
            
            {/* Descripción */}
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción (Opcional)</label>
               <textarea 
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  disabled={isSubmitting}
               />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button onClick={handleClose} disabled={isSubmitting} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50">
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={isSubmitting} className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg shadow-lg flex items-center gap-2 disabled:opacity-50">
            {isSubmitting ? 'Actualizando...' : <><Save className="w-5 h-5" /> Actualizar</>}
          </button>
        </div>
      </div>
      <style jsx>{`
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default ModalEditDonativo;