import React from 'react'
import { useFetchWarehouseProducts } from '../../../hook/useWarehouseProducts'

const WarehouseProductList = () => {
  const { data, isLoading, error } = useFetchWarehouseProducts()

  if (isLoading) return <p>Cargando productos en almacén...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <table className="w-full border text-left text-sm mt-6">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="border px-4 py-2">ID</th>
          <th className="border px-4 py-2">Almacén</th>
          <th className="border px-4 py-2">Producto</th>
          <th className="border px-4 py-2">Cantidad</th>
          <th className="border px-4 py-2">Fecha de ingreso</th>
        </tr>
      </thead>
      <tbody>
        {data?.data.map(item => (
          <tr key={item.id} className="hover:bg-gray-50">
            <td className="border px-4 py-2">{item.id}</td>
            <td className="border px-4 py-2">{item.warehouse_id}</td>
            <td className="border px-4 py-2">{item.product_id}</td>
            <td className="border px-4 py-2">{item.quantity}</td>
            <td className="border px-4 py-2">
              {new Date(item.entry_date).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default WarehouseProductList
