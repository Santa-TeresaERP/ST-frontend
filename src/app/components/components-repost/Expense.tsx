'use client'

import { useState } from 'react'
import { Plus, Search, Trash } from 'lucide-react'

interface Expense {
  id: number
  product: string
  quantity: number
  provider: string  
  date: string
  total: number
}

export default function Egresses() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, product: 'Harina', quantity: 50, provider: 'Proveedor A', date: '2024-11-14', total: 250 },
    { id: 2, product: 'Azúcar', quantity: 25, provider: 'Proveedor B', date: '2024-11-14', total: 125 },
    { id: 3, product: 'Huevos', quantity: 100, provider: 'Proveedor C', date: '2024-11-14', total: 200 },
    { id: 4, product: 'Leche', quantity: 30, provider: 'Proveedor A', date: '2024-11-14', total: 150 },
    { id: 5, product: 'Mantequilla', quantity: 20, provider: 'Proveedor B', date: '2024-11-14', total: 180 },
  ])
  const [selectedExpenses, setSelectedExpenses] = useState<number[]>([])
  const [newExpense, setNewExpense] = useState<Expense>({
    id: 0,
    product: '',
    quantity: 0,
    provider: '',
    date: '',
    total: 0,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  // Filtrar egresos por búsqueda
  const filteredExpenses = expenses.filter((expense) =>
    expense.product.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Abrir modal para agregar o editar egreso
  const handleOpenModal = (expense?: Expense) => {
    if (expense) {
      // Cargar los datos del producto para editar
      setNewExpense({ ...expense })
      setIsEditMode(true)
    } else {
      // Limpiar formulario para agregar un nuevo egreso
      setNewExpense({
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

  // Agregar un nuevo egreso
  const handleAddExpense = () => {
    if (
      newExpense.product &&
      newExpense.quantity &&
      newExpense.provider &&
      newExpense.date &&
      newExpense.total
    ) {
      const newId = expenses.length ? expenses[expenses.length - 1].id + 1 : 1
      setExpenses([...expenses, { ...newExpense, id: newId }])
      setIsModalOpen(false)
    }
  }

  // Editar un egreso
  const handleEditExpense = () => {
    if (
      newExpense.product &&
      newExpense.quantity &&
      newExpense.provider &&
      newExpense.date &&
      newExpense.total
    ) {
      setExpenses(
        expenses.map((expense) =>
          expense.id === newExpense.id ? newExpense : expense
        )
      )
      setIsModalOpen(false)
    }
  }

  // Eliminar egresos seleccionados
  const handleDeleteSelected = () => {
    setExpenses(expenses.filter((expense) => !selectedExpenses.includes(expense.id)))
    setSelectedExpenses([])
  }

  // Seleccionar/unselect un egreso
  const handleSelectExpense = (id: number) => {
    setSelectedExpenses((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="w-full p-4 flex-1">
        <div className="mx-auto max-w-screen-xl p-4 mb-8 rounded-lg bg-white shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Registrar y gestionar egresos</h2>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <div className="flex gap-2">
              <h3 className="mb-2 text-sm font-medium">Buscar Egresos</h3>
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
              <h3 className="mb-2 text-sm font-medium">Gestionar Egresos</h3>
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
                  onClick={handleDeleteSelected} // Eliminar los egresos seleccionados
                >
                  <Trash className="mr-1 h-4 w-4" />
                  ELIMINAR
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-screen-xl rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Lista de Egresos</h2>

          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="w-12">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    onChange={() => {
                      if (selectedExpenses.length === expenses.length) {
                        setSelectedExpenses([])
                      } else {
                        setSelectedExpenses(expenses.map((expense) => expense.id))
                      }
                    }}
                    checked={selectedExpenses.length === expenses.length}
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
              {filteredExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="p-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedExpenses.includes(expense.id)}
                      onChange={() => handleSelectExpense(expense.id)}
                    />
                  </td>
                  <td className="p-2">{expense.product}</td>
                  <td className="p-2">{expense.quantity}</td>
                  <td className="p-2">{expense.provider}</td>
                  <td className="p-2">{expense.date}</td>
                  <td className="p-2">${expense.total}</td>
                  <td>
                    <button
                      onClick={() => handleOpenModal(expense)} // Al hacer clic en editar, cargamos el producto
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
            <h2 className="text-lg font-medium">{isEditMode ? 'Editar Egreso' : 'Nuevo Egreso'}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium">Producto</label>
              <input
                type="text"
                value={newExpense.product}
                onChange={(e) => setNewExpense({ ...newExpense, product: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Producto"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Cantidad</label>
              <input
                type="number"
                value={newExpense.quantity}
                onChange={(e) => setNewExpense({ ...newExpense, quantity: Number(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Cantidad"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Proveedor</label>
              <input
                type="text"
                value={newExpense.provider}
                onChange={(e) => setNewExpense({ ...newExpense, provider: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Proveedor"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Fecha</label>
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Total de Compra</label>
              <input
                type="number"
                value={newExpense.total}
                onChange={(e) => setNewExpense({ ...newExpense, total: Number(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Total de Compra"
              />
            </div>
            <div className="flex justify-between">
              <button
                className="bg-gray-500 text-white p-2 rounded"
                onClick={handleCloseModal}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 text-white p-2 rounded"
                onClick={isEditMode ? handleEditExpense : handleAddExpense}
              >
                {isEditMode ? 'Actualizar' : 'Agregar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
