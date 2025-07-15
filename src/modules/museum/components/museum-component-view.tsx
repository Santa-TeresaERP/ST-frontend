import React, { useState } from 'react';
import Image from 'next/image';
import { Users, PlusCircle, Ticket, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
import ModalCreateVisitor, { VisitorData } from './visitor/modal-create-visitor';
import ModalEditVisitor from './visitor/modal-edit-visitor';
import ModalDeleteVisitor from './visitor/modal-delete-visitor';

const MuseumComponentView: React.FC = () => {
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorData | null>(null);

  const handleOpenCreate = () => setIsModalCreateOpen(true);
  const handleCloseCreate = () => setIsModalCreateOpen(false);

  const handleOpenEdit = (visitor: VisitorData) => {
    setSelectedVisitor(visitor);
    setIsModalEditOpen(true);
  };
  const handleCloseEdit = () => setIsModalEditOpen(false);

  const handleOpenDelete = (visitor: VisitorData) => {
    setSelectedVisitor(visitor);
    setIsModalDeleteOpen(true);
  };
  const handleCloseDelete = () => setIsModalDeleteOpen(false);

  const handleSaveVisitor = (data: VisitorData) => {
    console.log('Nuevo visitante guardado:', data);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-center text-red-700 pb-2 md:pb-4">
          Panel de Museo
        </h1>
        <p className="text-gray-600 text-center text-sm md:text-base">
          Gestión de visitantes y tickets
        </p>
      </div>

      <div className="flex justify-center mt-4 mb-6 md:mt-6 md:mb-8">
        <Image
          src="/museo-SantaTeresa.webp"
          alt="Museo Santa Teresa"
          width={1900}
          height={500}
          className="rounded-xl shadow-md object-cover object-top h-48 md:h-64 w-full"
        />
      </div>

      <div className="flex flex-col md:flex-row justify-end md:space-x-4 space-y-3 md:space-y-0 mb-5">
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg shadow hover:opacity-90 w-full md:w-auto"
        >
          <PlusCircle className="mr-2" size={20} />
          Nuevo Visitante
        </button>
        <button className="flex items-center justify-center bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg shadow hover:opacity-90 w-full md:w-auto">
          <Ticket className="mr-2" size={20} />
          Tipos de Tickets
        </button>
      </div>

      <div className="flex items-center text-red-700 text-2xl md:text-4xl font-bold mb-4">
        <Users className="mr-2" size={28} />
        Visitantes
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200 px-4 py-2">
        <table className="min-w-full text-sm md:text-base text-gray-700">
          <thead className="bg-gray-700 text-white text-center">
            <tr>
              <th className="px-3 py-2">Usuario</th>
              <th className="px-3 py-2">Tipo de Visitante</th>
              <th className="px-3 py-2">Canal de Venta</th>
              <th className="px-3 py-2">Monto Total</th>
              <th className="px-3 py-2">¿Gratis?</th>
              <th className="px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                tipoVisitante: 'Nacional',
                canalVenta: 'Web',
                fecha: '2025-07-01',
                monto: '20.00',
                gratis: 'No',
              },
              {
                tipoVisitante: 'Estudiante',
                canalVenta: 'Presencial',
                fecha: '2025-07-02',
                monto: '0.00',
                gratis: 'Si',
              },
            ].map((visitor, index) => (
              <tr key={index} className="border-t text-center">
                <td className="px-3 py-2">{index === 0 ? 'Juan Pérez' : 'María López'}</td>
                <td className="px-3 py-2">{visitor.tipoVisitante}</td>
                <td className="px-3 py-2">{visitor.canalVenta}</td>
                <td className="px-3 py-2">S/ {visitor.monto}</td>
                <td className="px-3 py-2">
                  {visitor.gratis === 'Si' ? (
                    <CheckCircle size={20} className="text-green-600 mx-auto" />
                  ) : (
                    <XCircle size={20} className="text-red-600 mx-auto" />
                  )}
                </td>
                <td className="px-3 py-2 space-x-2">
                  <button
                    className="text-blue-600 hover:scale-105"
                    onClick={() => handleOpenEdit(visitor)}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:scale-105"
                    onClick={() => handleOpenDelete(visitor)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalCreateVisitor
        isOpen={isModalCreateOpen}
        onClose={handleCloseCreate}
        onSave={handleSaveVisitor}
      />

      <ModalEditVisitor
        isOpen={isModalEditOpen}
        onClose={handleCloseEdit}
        initialData={selectedVisitor}
        onSave={handleSaveVisitor}
        />

      <ModalDeleteVisitor
        isOpen={isModalDeleteOpen}
        onClose={handleCloseDelete}
        onConfirm={() => {
          console.log('Visitante eliminado:', selectedVisitor);
          handleCloseDelete();
        }}
      />
    </div>
  );
};

export default MuseumComponentView;
