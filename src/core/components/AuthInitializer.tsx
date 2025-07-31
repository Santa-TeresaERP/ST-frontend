'use client';

import { useLoadUserFromToken } from '@/core/utils';

/**
 * 🔥 COMPONENTE QUE INICIALIZA LA AUTENTICACIÓN
 * Se ejecuta una vez al cargar la app
 */
export const AuthInitializer: React.FC = () => {
  useLoadUserFromToken();
  return null; // No renderiza nada
};
