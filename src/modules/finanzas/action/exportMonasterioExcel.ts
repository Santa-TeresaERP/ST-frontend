import api from '@/core/config/client'; 

export const exportMonasteriosExcel = async (startDate: string, endDate: string) => {
  const response = await api.post(
    '/getMonasterio/export-excel',
    { startDate, endDate }, // 👈 Fechas en el body
    { responseType: 'blob' } // 👈 Recibir el Excel como archivo
  );

  return response.data; // Devuelve un Blob (lo usas para descargar)
};
