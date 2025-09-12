// modules/reports/components/ModalGenerateSalePdf.tsx
import React from 'react'
import { FiX, FiFileText } from 'react-icons/fi'
import { GenerateSalePdfPayload } from '../../action/generatePdf'

type Props = {
  isOpen: boolean
  onClose: () => void
  defaultStoreId?: string
  defaultStoreName?: string
  onSubmit: (payload: GenerateSalePdfPayload) => void
  loading?: boolean
}

function toDateInputValue(date: Date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export default function ModalGenerateSalePdf({
  isOpen,
  onClose,
  defaultStoreId,
  defaultStoreName,
  onSubmit,
  loading,
}: Props) {
  const today = React.useMemo(() => new Date(), [])
  const [storeId, setStoreId] = React.useState(defaultStoreId ?? '')
  const [storeName, setStoreName] = React.useState(defaultStoreName ?? '')
  const [from, setFrom] = React.useState(toDateInputValue(today))
  const [to, setTo] = React.useState(toDateInputValue(today))
  const [filenameBase, setFilenameBase] = React.useState(
    `reporte_ventas_${(defaultStoreName || 'tienda').toLowerCase().replace(/\s+/g, '_')}`,
  )
  const [boxed, setBoxed] = React.useState(true)

  React.useEffect(() => {
    setStoreId(defaultStoreId ?? '')
    setStoreName(defaultStoreName ?? '')
    setFilenameBase(`reporte_ventas_${(defaultStoreName || 'tienda').toLowerCase().replace(/\s+/g, '_')}`)
  }, [defaultStoreId, defaultStoreName, isOpen])

  const formatLabel = React.useCallback((iso: string) => {
    const d = new Date(iso)
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString('es-PE')
  }, [])

  const dateLabel = `${formatLabel(from)} - ${formatLabel(to)}`

  const canSubmit = storeId && from && to && filenameBase && storeName

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({
      storeId,
      from,
      to,
      filenameBase,
      storeName,
      dateLabel,
      boxed,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <FiFileText className="text-red-600" />
            <h3 className="text-lg font-semibold">Generar PDF de Ventas</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Tienda (ID)</label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                placeholder="UUID de la tienda"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Nombre de la tienda</label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Ej: Tienda Central"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Desde</label>
              <input
                type="date"
                className="w-full rounded-lg border px-3 py-2"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Hasta</label>
              <input
                type="date"
                className="w-full rounded-lg border px-3 py-2"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Nombre base del archivo</label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                value={filenameBase}
                onChange={(e) => setFilenameBase(e.target.value)}
                placeholder="reporte_ventas_tienda_central"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Se generará como: {filenameBase}.pdf</p>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Etiqueta de fechas</label>
              <input
                className="w-full cursor-not-allowed rounded-lg border bg-gray-50 px-3 py-2"
                value={dateLabel}
                readOnly
              />
              <p className="mt-1 text-xs text-gray-500">Se calcula a partir de “Desde” y “Hasta”.</p>
            </div>

            <label className="flex items-center gap-2 md:col-span-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={boxed}
                onChange={(e) => setBoxed(e.target.checked)}
              />
              <span className="text-sm">Usar recuadro (boxed)</span>
            </label>
          </div>

          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!canSubmit || loading}
              className={`rounded-lg px-4 py-2 text-white ${
                !canSubmit || loading ? 'bg-red-300' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {loading ? 'Generando…' : 'Generar PDF'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
