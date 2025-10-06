import api from '@/core/config/client';

export const exportVentasExcel = async (startDate: string, endDate: string) => {
  const response = await api.post(
    '/ventasExcel/report-excel', // 👈 endpoint correcto
    { startDate, endDate },      // 👈 body con las fechas
    { responseType: 'blob' }     // 👈 necesario para Excel
  );

  return response.data; // Blob del Excel
};
