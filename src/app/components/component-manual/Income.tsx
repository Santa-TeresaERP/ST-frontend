"use client";

import { useState } from "react";
import { Plus, Trash } from "lucide-react";

interface Entry {
  id: number;
  product: string;
  quantity: number;
  date: string;
  total: number;
}

export default function Incomes() {
  const [entries, setEntries] = useState<Entry[]>([
    { id: 1, product: "Pinturas Acrílicas", quantity: 5, date: "2024-11-14", total: 100 },
    { id: 2, product: "Pinceles", quantity: 3, date: "2024-11-14", total: 60 },
    { id: 3, product: "Hilos para Bordado", quantity: 2, date: "2024-11-14", total: 40 },
  ]);

  const [newEntry, setNewEntry] = useState<Entry>({
    id: entries.length + 1,
    product: "",
    quantity: 0,
    date: new Date().toISOString().split("T")[0],
    total: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEntry({ ...newEntry, [name]: value });
  };

  const handleAddEntry = () => {
    if (!newEntry.product || newEntry.quantity <= 0) {
      alert("Por favor, complete todos los campos correctamente.");
      return;
    }
    setEntries([...entries, { ...newEntry, total: newEntry.quantity * 20 }]);
    setNewEntry({
      id: entries.length + 2,
      product: "",
      quantity: 0,
      date: newEntry.date,
      total: 0,
    });
    setIsModalOpen(false); // Cerrar el modal después de agregar
  };

  const handleDeleteEntry = (id: number) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filtrar los ingresos según la búsqueda
  const filteredEntries = entries.filter(entry => entry.product.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      {/* Main Content */}
      <main className="flex-grow flex flex-col p-4 bg-gray-50">
        {/* Search bar and Add button in the same row */}
        <div className="mb-4 flex items-center space-x-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Buscar por producto..."
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleOpenModal}
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
                <th className="border bg-red-500 text-white p-2">Producto</th>
                <th className="border bg-red-500 text-white p-2">Cantidad</th>
                <th className="border bg-red-500 text-white p-2">Fecha</th>
                <th className="border bg-red-500 text-white p-2">Precio Total</th>
                <th className="border bg-red-500 text-white p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.id}>
                  <td className="border p-2">{entry.product}</td>
                  <td className="border p-2">{entry.quantity}</td>
                  <td className="border p-2">{entry.date}</td>
                  <td className="border p-2">{entry.total}</td>
                  <td className="border p-2">
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

      {/* Modal for adding new entry */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-lg font-medium text-red-500">Registrar un Ingreso</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium">Producto</label>
              <input
                type="text"
                name="product"
                value={newEntry.product}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Escribe el nombre del producto"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Cantidad</label>
              <input
                type="number"
                name="quantity"
                value={newEntry.quantity}
                onChange={handleInputChange}
                placeholder="Cantidad"
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
              <label className="block text-sm font-medium">Precio Total</label>
              <input
                type="number"
                value={newEntry.total}
                onChange={(e) => setNewEntry({ ...newEntry, total: e.target.valueAsNumber })}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Total"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white p-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddEntry}
                className="bg-red-500 text-white p-2 rounded"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full bg-gray-200 text-center p-4">
        <p>&copy; 2024 Manualidades | Todos los derechos reservados</p>
      </footer>
    </div>
  );
}
