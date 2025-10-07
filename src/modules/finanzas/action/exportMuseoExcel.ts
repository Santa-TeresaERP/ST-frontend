import api from '@/core/config/client'; 

export const exportMuseoExcel = async (startDate: string, endDate: string) => {
  const response = await api.post(
    '/getMuseo/export-excel',   // 👈 endpoint del backend
    { startDate, endDate },  // 👈 Fechas en el body
    { responseType: 'blob' } // 👈 necesario para recibir el Excel como archivo
  );

  return response.data; // Devuelve un Blob para descargar
};
