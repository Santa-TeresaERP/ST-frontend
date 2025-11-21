'use client'

import { useState } from 'react'
import { Plus, Search, Trash } from 'lucide-react'

interface Craft {
  id: number
  product: string
  quantity: number
  provider: string
  date: string
  total: number
}

export default function Crafts() {
  const [searchQuery, setSearchQuery] = useState('')
  const [crafts, setCrafts] = useState<Craft[]>([
    { id: 1, product: 'Pintura', quantity: 50, provider: 'Proveedor A', date: '2024-11-14', total: 250 },
    { id: 2, product: 'Tijeras', quantity: 25, provider: 'Proveedor B', date: '2024-11-14', total: 125 },
    { id: 3, product: 'Hilo', quantity: 100, provider: 'Proveedor C', date: '2024-11-14', total: 200 },
    { id: 4, product: 'Pegamento', quantity: 30, provider: 'Proveedor A', date: '2024-11-14', total: 150 },
    { id: 5, product: 'Cartulina', quantity: 20, provider: 'Proveedor B', date: '2024-11-14', total: 180 },
  ])
  const [selectedCrafts, setSelectedCrafts] = useState<number[]>([])
  const [newCraft, setNewCraft] = useState<Craft>({
    id: 0,
    product: '',
    quantity: 0,
    provider: '',
    date: '',
    total: 0,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  // Filtrar manualidades por búsqueda
  const filteredCrafts = crafts.filter((craft) =>
    craft.product.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Abrir modal para agregar o editar manualidad
  const handleOpenModal = (craft?: Craft) => {
    if (craft) {
      // Cargar los datos de la manualidad para editar
      setNewCraft({ ...craft })
      setIsEditMode(true)
    } else {
      // Limpiar formulario para agregar una nueva manualidad
      setNewCraft({
        id: 0,
        product: '',
        quantity: 0,
        provider: '',
        date: '',
        total: 0,
      })
      setIsEditMode(false)
    }
    setIsModalOpen(true)
  }

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  // Agregar una nueva manualidad
  const handleAddCraft = () => {
    if (
      newCraft.product &&
      newCraft.quantity &&
      newCraft.provider &&
      newCraft.date &&
      newCraft.total
    ) {
      const newId = crafts.length ? crafts[crafts.length - 1].id + 1 : 1
      setCrafts([...crafts, { ...newCraft, id: newId }])
      setIsModalOpen(false)
    }
  }

  // Editar una manualidad
  const handleEditCraft = () => {
    if (
      newCraft.product &&
      newCraft.quantity &&
      newCraft.provider &&
      newCraft.date &&
      newCraft.total
    ) {
      setCrafts(
        crafts.map((craft) =>
          craft.id === newCraft.id ? newCraft : craft
        )
      )
      setIsModalOpen(false)
    }
  }

  // Eliminar manualidades seleccionadas
  const handleDeleteSelected = () => {
    setCrafts(crafts.filter((craft) => !selectedCrafts.includes(craft.id)))
    setSelectedCrafts([])
  }

  // Seleccionar/desmarcar una manualidad
  const handleSelectCraft = (id: number) => {
    setSelectedCrafts((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="w-full p-4 flex-1">
        <div className="mx-auto max-w-screen-xl p-4 mb-8 rounded-lg bg-white shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Registrar y gestionar manualidades</h2>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <div className="flex gap-2">
              <h3 className="mb-2 text-sm font-medium">Buscar Manualidades</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Buscar por nombre"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[300px] p-2 border border-gray-300 rounded"
                />
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                  <Search className="h-4 w-4" />
                  BUSCAR
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <h3 className="mb-2 text-sm font-medium">Gestionar Manualidades</h3>
              <div className="flex gap-2">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  onClick={() => handleOpenModal()}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  AGREGAR
                </button>
                <button
                  className="border border-red-500 text-red-500 px-4 py-2 rounded"
                  onClick={handleDeleteSelected} // Eliminar las manualidades seleccionadas
                >
                  <Trash className="mr-1 h-4 w-4" />
                  ELIMINAR
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-screen-xl rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Lista de Manualidades</h2>

          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="w-12">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    onChange={() => {
                      if (selectedCrafts.length === crafts.length) {
                        setSelectedCrafts([])
                      } else {
                        setSelectedCrafts(crafts.map((craft) => craft.id))
                      }
                    }}
                    checked={selectedCrafts.length === crafts.length}
                  />
                </th>
                <th className="bg-red-500 text-white p-2">Producto</th>
                <th className="bg-red-500 text-white p-2">Cantidad</th>
                <th className="bg-red-500 text-white p-2">Proveedor</th>
                <th className="bg-red-500 text-white p-2">Fecha</th>
                <th className="bg-red-500 text-white p-2">Total de Compra</th>
              </tr>
            </thead>
            <tbody>
              {filteredCrafts.map((craft) => (
                <tr key={craft.id}>
                  <td className="p-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedCrafts.includes(craft.id)}
                      onChange={() => handleSelectCraft(craft.id)}
                    />
                  </td>
                  <td className="p-2">{craft.product}</td>
                  <td className="p-2">{craft.quantity}</td>
                  <td className="p-2">{craft.provider}</td>
                  <td className="p-2">{craft.date}</td>
                  <td className="p-2">${craft.total}</td>
                  <td>
                    <button
                      onClick={() => handleOpenModal(craft)} // Al hacer clic en editar, cargamos la manualidad
                      className="text-red-500"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-lg font-medium">{isEditMode ? 'Editar Manualidad' : 'Nueva Manualidad'}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium">Producto</label>
              <input
                type="text"
                value={newCraft.product}
                onChange={(e) => setNewCraft({ ...newCraft, product: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Nombre del producto"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Cantidad</label>
              <input
                type="number"
                value={newCraft.quantity}
                onChange={(e) => setNewCraft({ ...newCraft, quantity: Number(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Cantidad"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Proveedor</label>
              <input
                type="text"
                value={newCraft.provider}
                onChange={(e) => setNewCraft({ ...newCraft, provider: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Proveedor"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Fecha</label>
              <input
                type="date"
                value={newCraft.date}
                onChange={(e) => setNewCraft({ ...newCraft, date: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Total</label>
              <input
                type="number"
                value={newCraft.total}
                onChange={(e) => setNewCraft({ ...newCraft, total: Number(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Total"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleCloseModal}
                className="border border-gray-300 text-gray-500 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={isEditMode ? handleEditCraft : handleAddCraft}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                {isEditMode ? 'Guardar' : 'Agregar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
