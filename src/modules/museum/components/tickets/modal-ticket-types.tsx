// components/ticket/modal-ticket-types.tsx
import React, { useState, useEffect } from 'react'
import { X, Plus, Trash2, Pencil } from 'lucide-react'
import { createTypePerson } from '../../action/typePerson'
import { useTypePerson } from '../../hook/useTypePerson'
import type { TypePerson } from '../../types/typePerson'

interface ModalTicketTypesProps {
  isOpen: boolean
  onClose: () => void
}

const ModalTicketTypes: React.FC<ModalTicketTypesProps> = ({ isOpen, onClose }) => {
  const { data: tiposPersona = [], loading, error, remove } = useTypePerson()
  const [newType, setNewType] = useState('')
  const [newPrice, setNewPrice] = useState('')
  // Lista local para UI
  const [localList, setLocalList] = useState<TypePerson[]>([])

  useEffect(() => {
    setLocalList(tiposPersona)
  }, [tiposPersona])

  const handleRequestEdit = (index: number) => {
    const tipo = localList[index]
    setNewType(tipo.name)
    setNewPrice(tipo.base_price.toString())
    // Si quieres editar directamente, guarda un estado de edición aquí
  }

  const handleRemove = async (id: string) => {
    try {
      await remove(id)
    } catch (err) {
      console.error('Error al eliminar:', err)
    }
  }

  const handleAddTicket = async () => {
    if (!newType.trim() || !newPrice.trim()) return
    const payload = { name: newType.trim(), base_price: parseFloat(newPrice) }
    try {
      const created = await createTypePerson(payload)
      setLocalList(prev => [...prev, created])
      setNewType('')
      setNewPrice('')
    } catch (err) {
      console.error('Error creando tipo:', err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 bg-gradient-to-r from-red-600 to-red-800 p-4 rounded-t-xl text-white">
          <div>
            <h2 className="text-2xl font-bold">Tipos de Ticket</h2>
            <p className="text-red-100">Administra los tipos de ticket disponibles</p>
          </div>
          <button onClick={onClose}><X size={24} /></button>
        </div>

        {/* Nuevo */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Tipo de Ticket"
            value={newType}
            onChange={e => setNewType(e.target.value)}
            className="flex-1 border rounded-full px-4 py-2"
          />
          <input
            type="number"
            placeholder="Precio"
            value={newPrice}
            onChange={e => setNewPrice(e.target.value)}
            className="w-32 border rounded-full px-4 py-2"
          />
          <button
            onClick={handleAddTicket}
            className="flex items-center bg-red-600 text-white px-4 py-2 rounded-full"
          >
            <Plus size={16} className="mr-1" /> Agregar
          </button>
        </div>

        {/* Lista */}
        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-600">Error al cargar</p>}
        <div className="space-y-2">
          {localList.map((tp, idx) => (
            <div key={tp.id || idx} className="flex justify-between items-center border p-3 rounded-xl">
              <div>
                <p className="font-semibold">{tp.name}</p>
                <p className="text-red-700">S/. {tp.base_price ? tp.base_price.toFixed(2) : '0.00'}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleRequestEdit(idx)} className="text-blue-600">
                  <Pencil size={18} />
                </button>
                <button onClick={() => tp.id && handleRemove(tp.id)} className="text-red-600">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ModalTicketTypes
