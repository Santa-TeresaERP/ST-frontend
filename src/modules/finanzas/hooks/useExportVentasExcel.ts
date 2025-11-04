import { exportVentasExcel } from '../action/exportVentasExcel'
import { ExportVentasExcelParams } from '../types/exportVentasExcel'

export const useExportVentasExcel = () => {
  const handleExport = async ({ startDate, endDate }: ExportVentasExcelParams) => {
    // 👇 aquí pasamos 2 argumentos separados
    const blob = await exportVentasExcel(startDate, endDate)

    // Crear link para descargar el archivo
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `ventas_${startDate}_${endDate}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return { handleExport }
}
