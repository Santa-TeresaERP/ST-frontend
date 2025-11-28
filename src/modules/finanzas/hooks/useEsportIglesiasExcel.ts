// src/hooks/useExportIglesiasExcel.ts

import { exportIglesiasExcel } from '../action/exportIglesiaExcel'; // Ajusta la ruta según tu estructura

export const useExportIglesiasExcel = () => {
  const handleExport = async ({ startDate, endDate }: { startDate: string; endDate: string }) => {
    try {
      // 1. Llamamos a tu servicio 'exportIglesiasExcel'
      const blob = await exportIglesiasExcel(startDate, endDate);

      // 2. Creamos la URL temporal para el archivo recibido
      const url = window.URL.createObjectURL(blob);
      
      // 3. Creamos el elemento <a> invisible
      const link = document.createElement('a');
      link.href = url;
      
      // 4. Definimos el nombre del archivo con las fechas para que sea ordenado
      link.setAttribute('download', `iglesias_${startDate}_${endDate}.xlsx`);
      
      // 5. Agregamos al DOM, ejecutamos click y limpiamos
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // 6. Liberamos la memoria del navegador
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Error al exportar el Excel de iglesias:", error);
      // Aquí podrías agregar un toast o alerta de error
    }
  };

  return { handleExport };
};