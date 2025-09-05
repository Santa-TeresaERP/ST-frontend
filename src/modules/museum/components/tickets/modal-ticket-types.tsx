// components/ticket/modal-ticket-types.tsx
import React, { useState } from 'react'
import { X, Plus, Trash2, Pencil, Check, ShieldAlert } from 'lucide-react'
import { useTypePerson } from '../../hook/useTypePerson'
import { useEntrance } from '../../hook/useEntrance'
import type { TypePerson } from '../../types/typePerson'
import { useModulePermission, MODULE_NAMES } from '@/core/utils/useModulesMap'
import AccessDeniedModal from '@/core/utils/AccessDeniedModal'

interface ModalTicketTypesProps {
  isOpen: boolean
  onClose: () => void
  onCreated?: () => void
}

const ModalTicketTypes: React.FC<ModalTicketTypesProps> = ({ isOpen, onClose, onCreated }) => {
  const { hasPermission: canView } = useModulePermission(MODULE_NAMES.MUSEUM, 'canRead')
  const { hasPermission: canCreate } = useModulePermission(MODULE_NAMES.MUSEUM, 'canWrite')
  const { hasPermission: canEdit } = useModulePermission(MODULE_NAMES.MUSEUM, 'canEdit')
  const { hasPermission: canDelete } = useModulePermission(MODULE_NAMES.MUSEUM, 'canDelete')
  const { data: tiposPersona = [], loading, error, create, update, remove } = useTypePerson()
  const { data: entrances = [] } = useEntrance()
  
  const [newType, setNewType] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editType, setEditType] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [showAccessDenied, setShowAccessDenied] = useState(false)
  const [accessDeniedAction, setAccessDeniedAction] = useState('')

  // Si no tiene permisos de lectura, mostrar mensaje de acceso denegado
  if (!canView) {
    return isOpen ? (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
          <ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600 mb-4">
            No tienes permisos para gestionar los tipos de tickets.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Contacta al administrador para obtener acceso.
          </p>
          <button 
            onClick={onClose}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    ) : null
  }

  const handleRequestEdit = (tipo: TypePerson) => {
    if (!canEdit) {
      setAccessDeniedAction('editar tipos de tickets')
      setShowAccessDenied(true)
      return
    }
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
    } catch (error: unknown) {
      // Si es error de permisos, mostrar modal de acceso denegado sin loggear
      const errorObj = error as { isPermissionError?: boolean; silent?: boolean; message?: string };
      if (errorObj?.isPermissionError && errorObj?.silent) {
        setAccessDeniedAction('editar tipos de tickets (permisos revocados)');
        setShowAccessDenied(true);
      } else {
        console.error('Error al actualizar:', error);
      }
    }
  }

  const isTypePersonUsed = (typePersonId: string) => {
    return entrances.some(entrance => entrance.type_person_id === typePersonId)
  }

  const handleRemove = async (id: string) => {
    if (!canDelete) {
      setAccessDeniedAction('eliminar tipos de tickets')
      setShowAccessDenied(true)
      return
    }

    if (isTypePersonUsed(id)) {
      alert('No se puede eliminar este tipo de ticket porque está asociado a entradas existentes.')
      return
    }
    
    try {
      await remove(id)
      if (onCreated) onCreated();
    } catch (error: unknown) {
      // Si es error de permisos, mostrar modal de acceso denegado sin loggear
      const errorObj = error as { isPermissionError?: boolean; silent?: boolean; message?: string };
      if (errorObj?.isPermissionError && errorObj?.silent) {
        setAccessDeniedAction('eliminar tipos de tickets (permisos revocados)');
        setShowAccessDenied(true);
      } else {
        console.error('Error al eliminar:', error);
      }
    }
  }

  const handleAddTicket = async () => {
    if (!canCreate) {
      setAccessDeniedAction('crear tipos de tickets')
      setShowAccessDenied(true)
      return
    }

    if (!newType.trim() || !newPrice.trim()) return
    
    const payload = { name: newType.trim(), base_price: parseFloat(newPrice) }
    try {
      await create(payload)
      setNewType('')
      setNewPrice('')
      if (onCreated) onCreated();
    } catch (error: unknown) {
      // Si es error de permisos, mostrar modal de acceso denegado sin loggear
      const errorObj = error as { isPermissionError?: boolean; silent?: boolean; message?: string };
      if (errorObj?.isPermissionError && errorObj?.silent) {
        setAccessDeniedAction('crear tipos de tickets (permisos revocados)');
        setShowAccessDenied(true);
      } else {
        console.error('Error creando tipo:', error);
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-0 overflow-y-auto max-h-[90vh]">
        {/* Header con estilo responsivo */}
        <div className="flex justify-between items-center mb-0 bg-gradient-to-r from-red-600 to-red-800 p-4 rounded-t-2xl text-white">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Tipos de Ticket</h2>
            <p className="text-sm md:text-base text-red-100">Administra los tipos de ticket disponibles</p>
          </div>
          <button onClick={() => { onClose(); window.location.reload(); }}><X size={24} /></button>
        </div>

        <div className="p-4 md:p-6">
          {/* Nuevo - Solo mostrar si tiene permisos de creación */}
          {canCreate && (
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="text"
                placeholder="Tipo de Ticket"
                value={newType}
                onChange={e => setNewType(e.target.value)}
                className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Precio"
                value={newPrice}
                onChange={e => setNewPrice(e.target.value)}
                className="w-full sm:w-32 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
              <button
                onClick={handleAddTicket}
                className="flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                <Plus size={16} className="mr-1" /> Agregar
              </button>
            </div>
          )}

          {/* Mensaje si no tiene permisos de creación */}
          {!canCreate && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                <ShieldAlert className="inline w-4 h-4 mr-2" />
                No tienes permisos para crear nuevos tipos de tickets.
              </p>
            </div>
          )}

          {/* Lista */}
          {loading && <p>Cargando...</p>}
          {error && <p className="text-red-600">Error al cargar</p>}
          <div className="space-y-2">
            {tiposPersona.map((tp) => (
              <div key={tp.id} className="flex flex-col sm:flex-row justify-between items-center border p-3 rounded-lg">
                {editingId === tp.id ? (
                  // Modo edición
                  <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                    <input
                      type="text"
                      value={editType}
                      onChange={e => setEditType(e.target.value)}
                      className="flex-1 border rounded px-3 py-1 w-full"
                    />
                    <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                      <span className="font-semibold text-gray-700">S/.</span>
                      <input
                        type="number"
                        value={editPrice}
                        onChange={e => setEditPrice(e.target.value)}
                        className="w-24 border rounded px-3 py-1"
                      />
                      <div className="flex gap-2 ml-auto sm:ml-0">
                        <button onClick={handleSaveEdit} className="text-green-600 hover:text-green-800 transition">
                          <Check size={18} />
                        </button>
                        <button onClick={handleCancelEdit} className="text-gray-600 hover:text-gray-800 transition">
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Modo vista
                  <>
                    <div className="flex-1 w-full">
                      <p className="font-semibold">{tp.name}</p>
                      <p className="text-red-700">S/. {tp.base_price ? tp.base_price.toFixed(2) : '0.00'}</p>
                    </div>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      {canEdit && (
                        <button onClick={() => handleRequestEdit(tp)} className="text-blue-600 hover:text-blue-800 transition">
                          <Pencil size={18} />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => tp.id && handleRemove(tp.id)}
                          className={`${isTypePersonUsed(tp.id || '') ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-800'}`}
                          disabled={isTypePersonUsed(tp.id || '')}
                          title={isTypePersonUsed(tp.id || '') ? 'No se puede eliminar porque está en uso' : 'Eliminar tipo de ticket'}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                      {(!canEdit && !canDelete) && (
                        <span className="text-gray-400 text-xs">Sin permisos</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de acceso denegado */}
      <AccessDeniedModal
        isOpen={showAccessDenied}
        onClose={() => setShowAccessDenied(false)}
        title="Permisos Insuficientes"
        message="No tienes permisos para realizar esta acción en la gestión de tipos de tickets."
        action={accessDeniedAction}
        module="Tipos de Tickets"
      />
    </div>
  )
}

export default ModalTicketTypes
