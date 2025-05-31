import React, { useState } from 'react';
import { Edit, Trash } from 'lucide-react';

type Warehouse = {
  id: number;
  nombre: string;
  ubicacion: string;
  capacidad: number;
  observaciones: string;
};

type ModalWarehousesProps = {
  onClose: () => void;
  almacenes: Warehouse[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
};

const ModalWarehouses: React.FC<ModalWarehousesProps> = ({
  onClose,
  almacenes,
  onEdit,
  onDelete,
  onAdd,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <header className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Almacenes</h2>
          <h3 className="mt-1 text-lg font-semibold bg-gradient-to-r from-red-600 to-red-400 text-white rounded px-3 py-1 inline-block">
            Administración de los Almacenes
          </h3>
        </header>

        {/* Botón + Agregar Almacén */}
        <div className="mb-6">
          <button
            onClick={onAdd}
            className="bg-red-700 hover:bg-red-800 text-white font-semibold px-5 py-2 rounded-md transition"
          >
            + Agregar Almacén
          </button>
        </div>

        {/* Subtítulo y contador */}
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-700">Almacenes Existentes</h4>
          <div className="bg-gray-300 text-gray-800 font-medium rounded px-3 py-1 min-w-[60px] text-center">
            {almacenes.length} {almacenes.length === 1 ? 'registro' : 'registros'}
          </div>
        </div>

        {/* Lista de almacenes */}
        <div className="space-y-4">
          {almacenes.length === 0 && (
            <p className="text-center text-gray-500">No hay almacenes registrados.</p>
          )}
          {almacenes.map(({ id, nombre, ubicacion, capacidad, observaciones }) => (
            <div
              key={id}
              className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex flex-col space-y-1 text-gray-700 max-w-[75%]">
                <p>
                  <span className="font-semibold">Nombre:</span> {nombre}
                </p>
                <p>
                  <span className="font-semibold">Ubicación:</span> {ubicacion}
                </p>
                <p>
                  <span className="font-semibold">Capacidad:</span> {capacidad} unidades
                </p>
                <p>
                  <span className="font-semibold">Observaciones:</span> {observaciones || 'Ninguna'}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => onEdit(id)}
                  title="Editar"
                  className="text-blue-600 hover:text-blue-800 transition"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => onDelete(id)}
                  title="Eliminar"
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <Trash size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cerrar modal */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-4 py-2 rounded-md transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalWarehouses;
