import api from '@/core/config/client';

export const exportVentasExcel = async (startDate: string, endDate: string) => {
  const response = await api.post(
    '/exportVentasExcelRoutes/',
    { startDate, endDate }, // 👈 se mandan las fechas en el body
    { responseType: 'blob' } // 👈 necesario para recibir el Excel como archivo
  );

  return response.data; // Devuelve un Blob
};
