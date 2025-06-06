import React, { useState } from 'react'
import { useCreateWarehouseProduct } from '../../../hook/useWarehouseProducts'

export default function WarehouseProductForm() {
  const { mutate, isPending } = useCreateWarehouseProduct()

  const [warehouseId, setWarehouseId] = useState('')
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [entryDate, setEntryDate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate({
      warehouse_id: warehouseId,
      product_id: productId,
      quantity,
      entry_date: entryDate,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input placeholder="ID de almacén" value={warehouseId} onChange={e => setWarehouseId(e.target.value)} />
      <input placeholder="ID de producto" value={productId} onChange={e => setProductId(e.target.value)} />
      <input type="number" placeholder="Cantidad" value={quantity} onChange={e => setQuantity(+e.target.value)} />
      <input type="date" value={entryDate} onChange={e => setEntryDate(e.target.value)} />
      <button type="submit" disabled={isPending}>
        Crear producto en almacén
      </button>
    </form>
  )
}
