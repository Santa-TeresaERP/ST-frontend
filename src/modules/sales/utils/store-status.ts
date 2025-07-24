/**
 * Utilidades para determinar el estado operativo de una tienda
 * basado en su sesión de caja activa
 */

// Interface para la respuesta de verificación de sesión activa
interface StoreActiveSessionData {
  success: boolean;
  isActive: boolean;
  message: string;
  store?: {
    id: string;
    store_name: string;
    address: string;
  };
  activeSession?: {
    id: string;
    user_id: string;
    start_amount: number;
    started_at: string;
    status: string;
  };
  error?: string;
}

// Función para determinar si una tienda está operativa
export const isStoreOperational = (storeSessionData: StoreActiveSessionData | undefined): boolean => {
  if (!storeSessionData) return false;
  return storeSessionData.success && storeSessionData.isActive;
};

// Función para obtener el mensaje de estado de una tienda
export const getStoreOperationalMessage = (storeSessionData: StoreActiveSessionData | undefined): string => {
  if (!storeSessionData) {
    return 'Seleccione una tienda para continuar';
  }
  
  if (!storeSessionData.success) {
    return storeSessionData.error || 'Error al verificar el estado de la tienda';
  }
  
  if (storeSessionData.isActive) {
    return 'Tienda operativa - Sesión de caja activa';
  }
  
  return 'Tienda no operativa - No hay sesión de caja activa';
};

// Función para obtener el texto del botón según el estado
export const getStoreButtonText = (storeSessionData: StoreActiveSessionData | undefined, defaultText: string): string => {
  if (!storeSessionData || !storeSessionData.success || !storeSessionData.isActive) {
    return `${defaultText} (Requiere sesión activa)`;
  }
  return defaultText;
};
