// MuseumComponentView.tsx
import React, { useState } from 'react'
import Image from 'next/image'
import { PlusCircle, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { useEntrance } from '../hook/useEntrance'
import ModalEditEntrance from './visitor/modal-edit-visitor'
import ModalDeleteEntrance from './visitor/modal-delete-visitor'
import ModalTicketTypes from './tickets/modal-ticket-types'
import { Entrance } from '../types/entrance'
import ModalCreateVisitor from './visitor/modal-create-visitor'

const MuseumComponentView: React.FC = () => {
  const { data, loading, error, update, remove, refetch } = useEntrance()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen,   setIsEditOpen]   = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selected,     setSelected]     = useState<Entrance | null>(null)
  const [isTicketOpen, setIsTicketOpen] = useState(false)

  const handleEdit = async (payload: Partial<Omit<Entrance, 'id'>>) => {
    if (!selected?.id) return
    try {
      await update(selected.id, payload)
      setIsEditOpen(false)
      console.log('Entrada actualizada exitosamente')
    } catch (error) {
      console.error('Error al actualizar entrada:', error)
      alert('Error al actualizar la entrada. Por favor, intente nuevamente.')
    }
  };
  const handleDelete = async () => {
    if (!selected?.id) return;
    await remove(selected.id);
    setIsDeleteOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center text-red-700">Panel de Visitantes</h1>
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-3xl font-semibold text-red-700 mb-2 sm:mb-0">Lista de Visitantes</h2>
        <div className="flex flex-col sm:flex-row justify-end gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center justify-center bg-red-700 text-white px-4 py-2 rounded-3xl whitespace-nowrap"
          >
            <PlusCircle className="mr-2" /> Nuevo Visitante
          </button>
          <button
            onClick={() => setIsTicketOpen(true)}
            className="flex items-center justify-center bg-red-700 text-white px-4 py-2 rounded-3xl whitespace-nowrap"
          >
            <PlusCircle className="mr-2" /> Tipos de Tickets
          </button>
        </div>
      </div>

      {loading && <p>Cargando visitantes…</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-gray-700">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2">Usuario</th>
              <th className="px-4 py-2">Tipo de Ticket</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Canal</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Pago</th>
              <th className="px-4 py-2">Gratis</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="px-4 py-2">{e.user?.name || e.user_id}</td>
                <td className="px-4 py-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {e.type_person?.name || 'N/A'}
                  </span>
                  {e.type_person?.base_price && (
                    <div className="text-xs text-gray-500">
                      S/ {e.type_person.base_price.toFixed(2)}
                    </div>
                  )}
                </td>
                <td className="px-4 py-2">{e.sale_date}</td>
                <td className="px-4 py-2">{e.sales_channel?.name || e.sale_channel}</td>
                <td className="px-4 py-2">S/ {e.total_sale.toFixed(2)}</td>
                <td className="px-4 py-2">{e.payment_method_obj?.name || e.payment_method}</td>
                <td className="px-4 py-2 text-center">
                  {e.free
                    ? <CheckCircle className="inline text-green-500" />
                    : <XCircle className="inline text-red-500" />}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => { setSelected(e); setIsEditOpen(true); }}>
                    <Pencil className="text-blue-600" />
                  </button>
                  <button onClick={() => { setSelected(e); setIsDeleteOpen(true); }}>
                    <Trash2 className="text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modales */}
      <ModalCreateVisitor
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => {
          setIsCreateOpen(false);
          refetch(); // Refrescar la tabla después de crear
        }}
      />

      <ModalEditEntrance
        isOpen={isEditOpen}
        initialData={selected}
        onClose={() => setIsEditOpen(false)}
        onSave={handleEdit}
      />

      <ModalDeleteEntrance
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />

      <ModalTicketTypes
        isOpen={isTicketOpen}
        onClose={() => setIsTicketOpen(false)}
      />
    </div>
  );
};

export default MuseumComponentView;