import api from '@/core/config/client'

export const exportRentalsExcel = async (startDate: string, endDate: string) => {
  const response = await api.post(
    '/getAlquileres/export-excel',
    { startDate, endDate },
    { responseType: 'blob' }
  )
  return response.data
}
