// components/ticket/modal-ticket-types.tsx
import React, { useState } from 'react'
import { X, Plus, Trash2, Pencil, Check } from 'lucide-react'
import { useTypePerson } from '../../hook/useTypePerson'
import { useEntrance } from '../../hook/useEntrance'
import type { TypePerson } from '../../types/typePerson'

interface ModalTicketTypesProps {
  isOpen: boolean
  onClose: () => void
  onCreated?: () => void
}

const ModalTicketTypes: React.FC<ModalTicketTypesProps> = ({ isOpen, onClose, onCreated }) => {
  const { data: tiposPersona = [], loading, error, create, update, remove } = useTypePerson()
  const { data: entrances = [] } = useEntrance()
  
  const [newType, setNewType] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editType, setEditType] = useState('')
  const [editPrice, setEditPrice] = useState('')

  const handleRequestEdit = (tipo: TypePerson) => {
    setEditingId(tipo.id || null)
    setEditType(tipo.name)
    setEditPrice(tipo.base_price.toString())
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditType('')
    setEditPrice('')
  }

  const handleSaveEdit = async () => {
    if (!editingId || !editType.trim() || !editPrice.trim()) return
    
    try {
      await update(editingId, {
        name: editType.trim(),
        base_price: parseFloat(editPrice)
      })
      setEditingId(null)
      setEditType('')
      setEditPrice('')
      if (onCreated) onCreated();
    } catch (err) {
      console.error('Error al actualizar:', err)
    }
  }

  const isTypePersonUsed = (typePersonId: string) => {
    return entrances.some(entrance => entrance.type_person_id === typePersonId)
  }

  const handleRemove = async (id: string) => {
    if (isTypePersonUsed(id)) {
      alert('No se puede eliminar este tipo de ticket porque está asociado a entradas existentes.')
      return
    }
    
    try {
      await remove(id)
    } catch (err) {
      console.error('Error al eliminar:', err)
    }
    if (onCreated) onCreated();
  }

  const handleAddTicket = async () => {
    if (!newType.trim() || !newPrice.trim()) return
    
    const payload = { name: newType.trim(), base_price: parseFloat(newPrice) }
    try {
      await create(payload)
      setNewType('')
      setNewPrice('')
      if (onCreated) onCreated();
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
          <button onClick={() => { onClose(); window.location.reload(); }}><X size={24} /></button>
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
          {tiposPersona.map((tp) => (
            <div key={tp.id} className="flex justify-between items-center border p-3 rounded-xl">
              {editingId === tp.id ? (
                // Modo edición
                <div className="flex-1 flex items-center gap-3">
                  <input
                    type="text"
                    value={editType}
                    onChange={e => setEditType(e.target.value)}
                    className="flex-1 border rounded px-3 py-1"
                  />
                  <input
                    type="number"
                    value={editPrice}
                    onChange={e => setEditPrice(e.target.value)}
                    className="w-24 border rounded px-3 py-1"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSaveEdit} className="text-green-600">
                      <Check size={18} />
                    </button>
                    <button onClick={handleCancelEdit} className="text-gray-600">
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                // Modo vista
                <>
                  <div>
                    <p className="font-semibold">{tp.name}</p>
                    <p className="text-red-700">S/. {tp.base_price ? tp.base_price.toFixed(2) : '0.00'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleRequestEdit(tp)} className="text-blue-600">
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => tp.id && handleRemove(tp.id)} 
                      className={`${isTypePersonUsed(tp.id || '') ? 'text-gray-400 cursor-not-allowed' : 'text-red-600'}`}
                      disabled={isTypePersonUsed(tp.id || '')}
                      title={isTypePersonUsed(tp.id || '') ? 'No se puede eliminar porque está en uso' : 'Eliminar tipo de ticket'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ModalTicketTypes
