'use client';

import { useLoadUserFromToken } from '@/core/utils';
import { useSyncUserPermissions } from '@/core/utils/useSyncUserPermissions';
import { useEffect, useState } from 'react';

/**
 * 🔥 COMPONENTE QUE INICIALIZA LA AUTENTICACIÓN
 * Se ejecuta una vez al cargar la app y sincroniza permisos cuando es necesario
 */
export const AuthInitializer: React.FC = () => {
  const [isClientReady, setIsClientReady] = useState(false);
  
  // Asegurar que solo se ejecute en el cliente
  useEffect(() => {
    setIsClientReady(true);
  }, []);

  useLoadUserFromToken();
  const { autoSyncIfNeeded } = useSyncUserPermissions();

  // Verificar si necesita sincronización adicional después de la carga inicial
  useEffect(() => {
    if (!isClientReady) return; // Solo ejecutar en el cliente
    
    const checkForSyncNeed = async () => {
      // Esperar un poco para que se complete la carga inicial
      setTimeout(async () => {
        await autoSyncIfNeeded();
      }, 1000);
    };

    checkForSyncNeed();
  }, [autoSyncIfNeeded, isClientReady]);

  return null; // No renderiza nada
};
