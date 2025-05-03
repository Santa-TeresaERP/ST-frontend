"use client";

import { useState } from "react";
import { Plus, Trash, Edit } from "lucide-react";

interface Entry {
  id: number;
  requester: string; // Solicitor name
  dni: string;
  date: string;
  type: "Difunto" | "Salud"; // Type filter
  recipient: string;
  totalPayment: number;
}

export default function Incomes() {
  const [entries, setEntries] = useState<Entry[]>([
    { id: 1, requester: "Juan Pérez", dni: "12345678", date: "2024-11-01", type: "Salud", recipient: "María García", totalPayment: 150 },
    { id: 2, requester: "Ana López", dni: "87654321", date: "2024-11-10", type: "Difunto", recipient: "Carlos Ramos", totalPayment: 300 },
    { id: 3, requester: "Luis Torres", dni: "11223344", date: "2024-11-15", type: "Salud", recipient: "Sofía Vega", totalPayment: 200 },
  ]);

  const [newEntry, setNewEntry] = useState<Entry>({
    id: entries.length + 1,
    requester: "",
    dni: "",
    date: new Date().toISOString().split("T")[0],
    type: "Salud",
    recipient: "",
    totalPayment: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<"Difunto" | "Salud" | "">(""); // Filter state
  const [editMode, setEditMode] = useState(false); // Edit mode state

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEntry({ ...newEntry, [name]: name === "totalPayment" ? parseFloat(value) : value });
  };

  const handleAddEntry = () => {
    if (!newEntry.requester || !newEntry.dni || !newEntry.recipient || newEntry.totalPayment <= 0) {
      alert("Por favor, complete todos los campos correctamente.");
      return;
    }

    if (editMode) {
      // Edit entry
      setEntries(entries.map((entry) => (entry.id === newEntry.id ? newEntry : entry)));
      setEditMode(false);
    } else {
      // Add new entry
      setEntries([...entries, { ...newEntry }]);
    }

    setNewEntry({
      id: entries.length + 2,
      requester: "",
      dni: "",
      date: new Date().toISOString().split("T")[0],
      type: "Salud",
      recipient: "",
      totalPayment: 0,
    });

    setIsModalOpen(false);
  };

  const handleDeleteEntry = (id: number) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const handleOpenModal = (entry?: Entry) => {
    if (entry) {
      setNewEntry(entry);
      setEditMode(true);
    } else {
      setNewEntry({
        id: entries.length + 1,
        requester: "",
        dni: "",
        date: new Date().toISOString().split("T")[0],
        type: "Salud",
        recipient: "",
        totalPayment: 0,
      });
      setEditMode(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value as "Difunto" | "Salud" | "");
  };

  const filteredEntries = filterType
    ? entries.filter((entry) => entry.type === filterType)
    : entries;

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      {/* Main Content */}
      <main className="flex-grow flex flex-col p-4 bg-gray-50">
        {/* Filter and Add button */}
        <div className="mb-4 flex items-center space-x-4">
          <select
            value={filterType}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">Todos</option>
            <option value="Difunto">Difunto</option>
            <option value="Salud">Salud</option>
          </select>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            AGREGAR NUEVO INGRESO
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow p-6 w-full">
          <h2 className="mb-4 text-lg font-bold text-red-500">Lista de Ingresos</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border bg-red-500 text-white p-2">Solicitante</th>
                <th className="border bg-red-500 text-white p-2">DNI</th>
                <th className="border bg-red-500 text-white p-2">Fecha</th>
                <th className="border bg-red-500 text-white p-2">Tipo</th>
                <th className="border bg-red-500 text-white p-2">Destinatario</th>
                <th className="border bg-red-500 text-white p-2">Pago Total</th>
                <th className="border bg-red-500 text-white p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.id}>
                  <td className="border p-2">{entry.requester}</td>
                  <td className="border p-2">{entry.dni}</td>
                  <td className="border p-2">{entry.date}</td>
                  <td className="border p-2">{entry.type}</td>
                  <td className="border p-2">{entry.recipient}</td>
                  <td className="border p-2">{entry.totalPayment}</td>
                  <td className="border p-2 flex space-x-2">
                    <button
                      onClick={() => handleOpenModal(entry)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-lg font-medium text-red-500">{editMode ? "Editar Ingreso" : "Registrar un Ingreso"}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium">Solicitante</label>
              <input
                type="text"
                name="requester"
                value={newEntry.requester}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">DNI</label>
              <input
                type="text"
                name="dni"
                value={newEntry.dni}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Fecha</label>
              <input
                type="date"
                name="date"
                value={newEntry.date}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Tipo</label>
              <select
                name="type"
                value={newEntry.type}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="Salud">Salud</option>
                <option value="Difunto">Difunto</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Destinatario</label>
              <input
                type="text"
                name="recipient"
                value={newEntry.recipient}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Pago Total</label>
              <input
                type="number"
                name="totalPayment"
                value={newEntry.totalPayment}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCloseModal}
                className="mr-2 bg-gray-300 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddEntry}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                {editMode ? "Guardar Cambios" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
