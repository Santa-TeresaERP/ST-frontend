// MuseumComponentView.tsx
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { PlusCircle, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { useEntrance } from '../hook/useEntrance'
import ModalEditEntrance from './visitor/modal-edit-visitor'
import ModalDeleteEntrance from './visitor/modal-delete-visitor'
import ModalTicketTypes from './tickets/modal-ticket-types'
import { Entrance, EntrancePayload } from '../types/entrance'
import ModalCreateVisitor, { VisitorData } from './visitor/modal-create-visitor'
import { useAuthStore } from '@/core/store/auth';

const MuseumComponentView: React.FC = () => {
  const { data, loading, error, create, update, remove, refetch } = useEntrance()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen,   setIsEditOpen]   = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selected,     setSelected]     = useState<Entrance | null>(null)
  const [isTicketOpen, setIsTicketOpen] = useState(false)
  const user = useAuthStore((state) => state.user);

  useEffect(() => { refetch() }, [])

  const handleCreate = async (data: VisitorData) => {
    if (!user) return;

    const payload: EntrancePayload = {
      user_id: user.id,
      type_person_id: data.tipoVisitante,
      sale_date: data.fecha,
      sale_number: 'V-' + Date.now(), // o como se genere
      sale_channel: data.canalVenta,
      total_sale: parseFloat(data.monto),
      payment_method: data.tipoPago,
      free: data.gratis === 'Si',
    };

    await create(payload);
    setIsCreateOpen(false);
  };

  const handleEdit = async (payload: Partial<Omit<Entrance, 'id'>>) => {
    if (!selected?.id) return
    await update(selected.id, payload)
    setIsEditOpen(false)
  }
  const handleDelete = async () => {
    if (!selected?.id) return
    await remove(selected.id)
    setIsDeleteOpen(false)
  }

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

      <div className="flex justify-between mb-4">
        <h2 className="text-3xl font-semibold text-red-700">Lista de Visitantes</h2>
        <div className='justify-end flex gap-2'>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center bg-red-700 text-white px-4 py-2 rounded-3xl"
          >
            <PlusCircle className="mr-2" /> Nuevo Visitante
          </button>
          <button
            onClick={() => setIsTicketOpen(true)}
            className="flex items-center bg-red-700 text-white px-4 py-2 rounded-3xl"
          >
            <PlusCircle className="mr-2" /> Tipos de Tickets
          </button>
        </div>
      </div>

      {loading && <p>Cargando visitantes…</p>}
      {error   && <p className="text-red-600">Error: {error}</p>}

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-gray-700">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2">Usuario</th>
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
                <td className="px-4 py-2">{e.user_id}</td>
                <td className="px-4 py-2">{e.sale_date}</td>
                <td className="px-4 py-2">{e.sale_channel}</td>
                <td className="px-4 py-2">S/ {e.total_sale.toFixed(2)}</td>
                <td className="px-4 py-2">{e.payment_method}</td>
                <td className="px-4 py-2 text-center">
                  {e.free
                    ? <CheckCircle className="inline text-green-500"/>
                    : <XCircle     className="inline text-red-500"/>}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => { setSelected(e); setIsEditOpen(true) }}>
                    <Pencil className="text-blue-600"/>
                  </button>
                  <button onClick={() => { setSelected(e); setIsDeleteOpen(true) }}>
                    <Trash2 className="text-red-600"/>
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
        onSave={handleCreate}
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
  )
}

export default MuseumComponentView
