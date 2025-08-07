// MuseumComponentView.tsx
import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { PlusCircle, Pencil, Trash2, CheckCircle, XCircle, Filter } from 'lucide-react'
import { useEntrance } from '../hook/useEntrance'
import ModalEditEntrance from './visitor/modal-edit-visitor'
import ModalDeleteEntrance from './visitor/modal-delete-visitor'
import ModalTicketTypes from './tickets/modal-ticket-types'
import { Entrance } from '../types/entrance'
import ModalCreateVisitor from './visitor/modal-create-visitor'
import { toast } from 'react-toastify'

const MuseumComponentView: React.FC = () => {
  const { data, loading, error, update, remove, refetch } = useEntrance()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<Entrance | null>(null)
  const [isTicketOpen, setIsTicketOpen] = useState(false)
  const [dateFilter, setDateFilter] = useState<'last3days' | 'last7days' | 'last30days' | 'all'>('last3days')

  const handleEdit = async (payload: Partial<Omit<Entrance, 'id'>>) => {
    if (!selected?.id) return
    try {
      await update(selected.id, payload)
      setIsEditOpen(false)
      toast.success('Entrada actualizada exitosamente')
    } catch (error) {
      console.error('Error al actualizar entrada:', error)
      toast.error('Error al actualizar la entrada. Por favor, intente nuevamente.')
    }
  };

  const handleDelete = async () => {
    if (!selected?.id) return;
    try {
      await remove(selected.id);
      setIsDeleteOpen(false);
      toast.success('Entrada eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar entrada:', error);
      toast.error('Error al eliminar la entrada. Por favor, intente nuevamente.');
    }
  };

  const filteredData = useMemo(() => {
    if (!data) return [];

    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    return data.filter(e => {
      const entranceDate = new Date(e.sale_date);
      entranceDate.setHours(0, 0, 0, 0); // Normalizar la hora para una comparación precisa

      if (dateFilter === 'last3days') {
        return entranceDate >= threeDaysAgo;
      }
      if (dateFilter === 'last7days') {
        return entranceDate >= sevenDaysAgo;
      }
      if (dateFilter === 'last30days') {
        return entranceDate >= thirtyDaysAgo;
      }
      return true; // 'all'
    });
  }, [data, dateFilter]);

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
      
      {/* Filtro de Fecha */}
      <div className="flex items-center mb-4 gap-2">
        <label className="text-gray-700 font-semibold flex items-center gap-1">
          <Filter size={16} /> Mostrar:
        </label>
        <select
          className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
        >
          <option value="last3days">Últimos 3 días</option>
          <option value="last7days">Últimos 7 días</option>
          <option value="last30days">Últimos 30 días</option>
          <option value="all">Todos</option>
        </select>
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
            {filteredData.length > 0 ? (
              filteredData.map((e) => (
                <tr key={e.id} className="border-t hover:bg-gray-50 transition-colors">
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
                    <button onClick={() => { setSelected(e); setIsEditOpen(true); }} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                      <Pencil className="text-blue-600" size={18} />
                    </button>
                    <button onClick={() => { setSelected(e); setIsDeleteOpen(true); }} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                      <Trash2 className="text-red-600" size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-4 text-center text-gray-500">
                  No hay visitantes registrados en este periodo.
                </td>
              </tr>
            )}
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