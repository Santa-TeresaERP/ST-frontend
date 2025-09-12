import { exportRentalsExcel } from '../action/exportRentalsExcel'

export const useExportRentalsExcel = () => {
  const handleExport = async ({ startDate, endDate }: { startDate: string; endDate: string }) => {
    const blob = await exportRentalsExcel(startDate, endDate)

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `alquileres_${startDate}_${endDate}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return { handleExport }
}
