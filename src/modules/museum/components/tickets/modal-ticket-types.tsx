// components/ticket/modal-ticket-types.tsx
import React, { useState } from 'react';
import { X, Plus, Trash2, ClipboardPlus } from 'lucide-react';

interface TicketType {
  type: string;
  price: string;
}

interface ModalTicketTypesProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalTicketTypes: React.FC<ModalTicketTypesProps> = ({ isOpen, onClose }) => {
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [newType, setNewType] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<{ index: number; name: string } | null>(null);

  const handleAddTicket = () => {
    if (newType.trim() && newPrice.trim()) {
      setTicketTypes([...ticketTypes, { type: newType, price: newPrice }]);
      setNewType('');
      setNewPrice('');
    }
  };

  const confirmDelete = () => {
    if (ticketToDelete) {
      setTicketTypes(ticketTypes.filter((_, i) => i !== ticketToDelete.index));
      setTicketToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleRequestDelete = (index: number) => {
    const name = ticketTypes[index].type;
    setTicketToDelete({ index, name });
    setShowDeleteModal(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-[90%] max-w-4xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header con gradiente y botón de cierre */}
        <div className="relative bg-gradient-to-r from-red-600 to-red-800 rounded-t-xl -m-6 mb-2 p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Tipos de Ticket
              </h2>
              <p className="text-red-100 mt-1">Administra los tipos de ticket disponibles</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-full hover:bg-red-700 transition-colors duration-200 text-white"
              aria-label="Cerrar modal"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Formulario */}
        <div className="p-2 space-y-4">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-3 space-y-3 sm:space-y-0">
            <div className="flex items-center bg-white border border-red-300 rounded-full px-4 py-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Tipo de Ticket"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="outline-none w-full text-sm"
              />
            </div>
            <div className="flex items-center bg-white border border-red-300 rounded-full px-4 py-2 w-full sm:w-auto">
              <input
                type="number"
                placeholder="Precio"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="outline-none w-full text-sm"
              />
            </div>
            <button
              onClick={handleAddTicket}
              className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow"
            >
              <Plus size={16} className="mr-1" /> Ticket
            </button>
          </div>

          <div className="space-y-2">

            <div className="flex items-center mb-4">
              <span className="w-3 h-3 bg-red-600 rounded-full mr-3"></span>
              <h3 className="text-xl font-semibold text-gray-800">Tickets Existentes</h3>
              <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {ticketTypes.length} en total
              </span>
            </div>
            
            {ticketTypes.map((ticket, index) => (
              <div
                key={index}
                className="flex justify-between items-center border border-gray-300 rounded-xl px-4 py-2 shadow-sm"
              >
                <div>
                  <p className="font-semibold text-sm">{ticket.type}</p>
                  <p className="text-red-700 text-sm">S/. {parseFloat(ticket.price).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => handleRequestDelete(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            {showDeleteModal && ticketToDelete && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs sm:max-w-sm p-4 max-h-[70vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-t-xl p-4">
                    <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white">Confirmar Eliminación</h2>
                    <button
                        onClick={() => setShowDeleteModal(false)}
                        className="p-1.5 rounded-full hover:bg-red-800 transition-colors duration-200 text-white"
                    >
                        <X size={18} />
                    </button>
                    </div>
                </div>

                {/* Contenido */}
                <div className="p-4 space-y-3">
                    <div className="flex justify-center">
                    <div className="bg-red-100 p-3 rounded-full">
                        <Trash2 className="h-8 w-8 text-red-600" />
                    </div>
                    </div>
                    <p className="text-center text-sm text-gray-700">
                    ¿Estás seguro de que deseas eliminar la categoría{" "}
                    <span className="font-semibold">&quot;{ticketToDelete.name}&quot;</span>?
                    </p>
                    <p className="text-center text-xs text-gray-500">
                    Esta acción no se puede deshacer.
                    </p>
                </div>

                {/* Botones */}
                <div className="flex justify-center space-x-3 px-4 pb-4 pt-2">
                    <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-sm text-gray-700"
                    >
                    Cancelar
                    </button>
                    <button
                    onClick={confirmDelete}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white text-sm shadow hover:shadow-md flex items-center gap-2"
                    >
                    <Trash2 size={16} />
                    <span>Eliminar</span>
                    </button>
                </div>
                </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalTicketTypes;