'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import Image from 'next/image'

interface Craft {
  id: number
  name: string
  price: number
  stock: number
  image: string // La imagen será una cadena en base64
}

export default function Component() {
  const [crafts, setCrafts] = useState<Craft[]>([
    {
      id: 1,
      name: 'Jarrón de Cerámica',
      price: 30.0,
      stock: 10,
      image: '/jarro.png',
    },
    {
      id: 2,
      name: 'Collares de Perlas',
      price: 20.5,
      stock: 15,
      image: '/collar.png',
    },
    {
      id: 3,
      name: 'Cuadro Pintado a Mano',
      price: 50.0,
      stock: 5,
      image: '/cuadro.png',
    },
  ])

  const [stock, setStock] = useState<number | null>(null)
  const [craftName, setCraftName] = useState<string | null>(null)
  const [craftPrice, setCraftPrice] = useState<number | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [editingCraftId, setEditingCraftId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setImageFile(file)

    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string)
      }
      reader.readAsDataURL(file) // Convertir imagen a base64
    }
  }

  const handleAddOrUpdateCraft = () => {
    if (editingCraftId !== null) {
      // Actualizar manualidad existente
      setCrafts(crafts.map(craft =>
        craft.id === editingCraftId
          ? {
              ...craft,
              name: craftName || craft.name, // Mantener valores existentes si no se cambian
              price: craftPrice !== null ? craftPrice : craft.price,
              stock: stock !== null ? stock : craft.stock,
              image: previewImage || craft.image,
            }
          : craft
      ))
      setEditingCraftId(null)
    } else {
      // Validar campos necesarios para una nueva manualidad
      if (!craftName || craftPrice === null || stock === null || !imageFile) return

      // Agregar nueva manualidad
      const newCraft: Craft = {
        id: crafts.length + 1,
        name: craftName,
        price: craftPrice,
        stock: stock,
        image: previewImage || '/placeholder.svg',
      }
      setCrafts([...crafts, newCraft])
    }

    resetForm()
    setIsModalOpen(false)
  }

  const handleEditCraft = (id: number) => {
    const craft = crafts.find((craft) => craft.id === id)
    if (craft) {
      setCraftName(craft.name)
      setCraftPrice(craft.price)
      setStock(craft.stock)
      setPreviewImage(craft.image)
      setEditingCraftId(craft.id)
      setIsModalOpen(true)
    }
  }

  const resetForm = () => {
    setCraftName(null)
    setCraftPrice(null)
    setStock(null)
    setImageFile(null)
    setPreviewImage(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-full">
      <main className="flex-grow w-full p-4">
        <div className="mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md flex items-center"
          >
            <Plus className="mr-1 h-4 w-4" />
            AGREGAR MANUALIDAD
          </button>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm w-full">
          <h2 className="mb-4 text-lg font-medium">Lista de Manualidades</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {crafts.map((craft) => (
              <div
                key={craft.id}
                className="overflow-hidden bg-white shadow-md rounded-md w-[350px] h-[450px]"
              >
                <div className="p-0">
                  <Image
                    src={craft.image}
                    alt={craft.name}
                    width={400}
                    height={300}
                    className="h-64 w-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold">{craft.name}</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>Precio: S/. {craft.price.toFixed(2)}</p>
                    <p>Stock: {craft.stock} unidades</p>
                  </div>
                </div>
                <div className="flex gap-2 p-4 pt-0">
                  <button
                    className="flex-1 bg-red-500 text-white p-2 rounded-md"
                    onClick={() => setCrafts(crafts.filter((c) => c.id !== craft.id))}
                  >
                    Eliminar
                  </button>
                  <button
                    className="flex-1 border border-gray-300 p-2 rounded-md"
                    onClick={() => handleEditCraft(craft.id)}
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{editingCraftId ? 'Editar Manualidad' : 'Agregar Manualidad'}</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              placeholder="Nombre de la manualidad"
              value={craftName || ''}
              onChange={(e) => setCraftName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <input
              type="number"
              placeholder="Precio de la manualidad"
              value={craftPrice !== null ? craftPrice : ''}
              onChange={(e) => setCraftPrice(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <input
              type="number"
              placeholder="Stock"
              value={stock !== null ? stock : ''}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            {previewImage && (
              <div className="mb-4">
                <Image
                  src={previewImage}
                  alt="Vista previa"
                  width={200}
                  height={200}
                  className="object-cover rounded-md"
                />
              </div>
            )}
            <button
              onClick={handleAddOrUpdateCraft}
              className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded-md"
            >
              {editingCraftId ? 'ACTUALIZAR' : 'AGREGAR'}
            </button>
          </div>
        </div>
      )}

      <footer className="bg-gray-200 p-4 text-center w-full">
        <p>&copy; 2024 Manualidades | Todos los derechos reservados</p>
      </footer>
    </div>
  )
}
