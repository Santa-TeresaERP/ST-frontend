import { exportMonasteriosExcel } from '../action/exportMonasterioExcel'
import { ExportVentasExcelParams } from '../types/exportVentasExcel' 

// 👆 Reutilizamos el mismo tipo, porque también recibe { startDate, endDate }

export const useExportMonasteriosExcel = () => {
  const handleExport = async ({ startDate, endDate }: ExportVentasExcelParams) => {
    const blob = await exportMonasteriosExcel(startDate, endDate)

    // Crear link para descargar el archivo
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `monasterios_${startDate}_${endDate}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return { handleExport }
}
