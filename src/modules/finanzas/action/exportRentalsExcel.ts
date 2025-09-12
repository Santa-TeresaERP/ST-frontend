import api from '@/core/config/client';

export const exportRentalsExcel = async (startDate: string, endDate: string) => {
  const response = await api.post(
    '/rentalsExcel/by-date/excel',   // 👈 aquí estaba el error
    { startDate, endDate },
    { responseType: 'blob' }
  );

  return response.data;
};
