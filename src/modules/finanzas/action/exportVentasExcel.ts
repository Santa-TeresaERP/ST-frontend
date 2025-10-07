import api from '@/core/config/client';

export const exportVentasExcel = async (startDate: string, endDate: string) => {
  const response = await api.post(
    '/getVentas/export-excel',
    { startDate, endDate }, // 👈 se mandan las fechas en el body
    { responseType: 'blob' } // 👈 necesario para recibir el Excel como archivo
  );
  return response.data; // Blob del Excel
};
