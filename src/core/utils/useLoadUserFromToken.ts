import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/core/store/auth';
import { useCurrentUser } from '@/modules/auth/hook/useCurrentUser';
import { UserWithPermissions } from '@/core/utils/permission-types';

/**
 * 🔥 HOOK PARA CARGAR USUARIO DESDE TOKEN AL INICIAR LA APP
 * Usa el endpoint /auth/me para obtener datos del usuario con permisos completos
 * Se ejecuta automáticamente al cargar la aplicación si hay un token válido
 */
export const useLoadUserFromToken = () => {
  const { user, userWithPermissions, setUser, setUserWithPermissions } = useAuthStore();
  const { data: currentUserData, isLoading, error } = useCurrentUser();
  const hasTriedToLoad = useRef(false);
  const [isClientReady, setIsClientReady] = useState(false);

  // Asegurar que solo se ejecute en el cliente para evitar hidratación
  useEffect(() => {
    setIsClientReady(true);
  }, []);

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (!isClientReady || typeof window === 'undefined') return;
    
    const token = localStorage.getItem('authToken');
    
    // Intentar cargar usuario solo si:
    // 1. Hay un token válido
    // 2. No hay usuario con permisos completos en store (o está incompleto)
    // 3. No está cargando actualmente
    // 4. No hemos intentado cargar antes
    // 5. Tenemos datos del usuario desde la API
    const shouldLoadUser = token && 
                          !isLoading && 
                          !hasTriedToLoad.current && 
                          currentUserData &&
                          (!userWithPermissions || !userWithPermissions.Role?.Permissions?.length);

    if (shouldLoadUser) {
      console.log('🔍 =================================');
      console.log('🔍 CARGANDO USUARIO DESDE /auth/me');
      console.log('🔍 =================================');
      
      hasTriedToLoad.current = true;
      
      console.log('🔍 ✅ Usuario obtenido desde /auth/me:', {
        id: currentUserData.id,
        name: currentUserData.name,
        role: currentUserData.Role?.name,
        totalPermissions: currentUserData.Role?.Permissions?.length || 0,
        hasCompletePermissions: !!currentUserData.Role?.Permissions?.length
      });
      
      // Crear objeto de usuario básico
      const extendedUserData = currentUserData as UserWithPermissions & { 
        dni?: string; 
        phonenumber?: string; 
      };
      
      const basicUser = {
        id: currentUserData.id || '',
        name: currentUserData.name,
        email: currentUserData.email,
        roleId: currentUserData.roleId,
        dni: extendedUserData.dni || '',
        phonenumber: extendedUserData.phonenumber || '',
        password: '',
        status: currentUserData.status
      };
      
      // Guardar en el store
      setUser(basicUser);
      setUserWithPermissions(currentUserData);
      
      console.log('🔍 ✅ Usuario cargado en el store con permisos completos');
      console.log('🔍 🎯 Permisos disponibles:', currentUserData.Role?.Permissions?.length || 0);
      console.log('🔍 =================================');
    }
    
    // Si ya tenemos usuario con permisos completos, marcar como cargado
    if (userWithPermissions?.Role?.Permissions?.length) {
      hasTriedToLoad.current = true;
    }
  }, [currentUserData, isLoading, setUser, setUserWithPermissions, userWithPermissions, isClientReady]);

  // 🔥 MANEJO DE ERRORES (ej: token expirado o inválido)
  useEffect(() => {
    if (!isClientReady) return;
    
    if (error && !user) {
      console.log('🔍 ❌ Error obteniendo usuario actual, limpiando token...');
      localStorage.removeItem('authToken');
      hasTriedToLoad.current = false;
    }
  }, [error, user, isClientReady]);

  // 🔥 RESET del flag cuando se hace logout
  useEffect(() => {
    if (!isClientReady) return;
    
    const token = localStorage.getItem('authToken');
    if (!user && !token) {
      hasTriedToLoad.current = false;
      console.log('🔄 Reset flag de carga - Ready para nueva sesión');
    }
  }, [user, isClientReady]);
};
