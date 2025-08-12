import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/core/store/auth';
import { useCurrentUser } from '@/modules/auth/hook/useCurrentUser';

/**
 * 🔥 HOOK PARA CARGAR USUARIO DESDE TOKEN AL INICIAR LA APP
 * Usa el endpoint /auth/me para obtener datos del usuario sin permisos especiales
 * Se ejecuta automáticamente al cargar la aplicación si hay un token válido
 */
export const useLoadUserFromToken = () => {
  const { user, setUser, setUserWithPermissions } = useAuthStore();
  const { data: currentUserData, isLoading, error } = useCurrentUser();
  const hasTriedToLoad = useRef(false); // Evita múltiples cargas

  useEffect(() => {
    // Intentar cargar usuario solo si:
    // 1. No hay usuario en store
    // 2. No está cargando
    // 3. No hemos intentado cargar antes
    // 4. Tenemos datos del usuario
    if (!user && !isLoading && !hasTriedToLoad.current && currentUserData) {
      const token = localStorage.getItem('authToken');
      
      if (token && currentUserData) {
        console.log('🔍 =================================');
        console.log('🔍 CARGANDO USUARIO DESDE /auth/me');
        console.log('🔍 =================================');
        
        hasTriedToLoad.current = true; // Marcar que ya intentamos cargar
        
        console.log('🔍 ✅ Usuario obtenido desde /auth/me:', {
          id: currentUserData.id,
          name: currentUserData.name,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          role: (currentUserData as any).Role?.name,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          totalPermissions: (currentUserData as any).Role?.Permissions?.length || 0
        });
        
        // Crear objeto de usuario básico (sin password por seguridad)
        const basicUser = {
          id: currentUserData.id || '',
          name: currentUserData.name,
          email: currentUserData.email,
          roleId: currentUserData.roleId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dni: (currentUserData as any).dni || '',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          phonenumber: (currentUserData as any).phonenumber || '',
          password: '', // No guardar password por seguridad
          status: currentUserData.status
        };
        
        // Guardar en el store
        setUser(basicUser);
        setUserWithPermissions(currentUserData);
        
        console.log('🔍 ✅ Usuario cargado en el store desde /auth/me');
        console.log('🔍 =================================');
      }
    }
    
    // Si ya hay usuario, marcar que ya cargamos
    if (user) {
      hasTriedToLoad.current = true;
    }
  }, [user, currentUserData, isLoading, setUser, setUserWithPermissions]);

  // 🔥 MANEJO DE ERRORES (ej: token expirado o inválido)
  useEffect(() => {
    if (error && !user) {
      console.log('🔍 ❌ Error obteniendo usuario actual, limpiando token...');
      localStorage.removeItem('authToken');
      hasTriedToLoad.current = false;
    }
  }, [error, user]);

  // 🔥 RESET del flag cuando se hace logout
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!user && !token) {
      hasTriedToLoad.current = false;
      console.log('🔄 Reset flag de carga - Ready para nueva sesión');
    }
  }, [user]);
};
