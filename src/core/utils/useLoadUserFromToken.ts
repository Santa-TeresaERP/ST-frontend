import { useEffect } from 'react';
import { useAuthStore } from '@/core/store/auth';
import { useFetchUsers } from '@/modules/user-creations/hook/useUsers';
import { UserWithPermissions } from './permission-types';

/**
 * 🔥 HOOK PARA CARGAR USUARIO DESDE TOKEN AL INICIAR LA APP
 * Este hook se ejecuta cuando la app inicia y hay un token guardado
 */
export const useLoadUserFromToken = () => {
  const { user, setUser, setUserWithPermissions } = useAuthStore();
  const { data: users } = useFetchUsers();

  useEffect(() => {
    // Solo intentar cargar si no hay usuario pero hay token
    if (!user) {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      if (token && users) {
        console.log('🔍 =================================');
        console.log('🔍 CARGANDO USUARIO DESDE TOKEN');
        console.log('🔍 =================================');
        
        try {
          // Decodificar el token para obtener el userId
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload.userId || payload.id || payload.user_id || payload.sub;
          
          console.log('🔍 Token decodificado:', {
            payload,
            userId,
            totalUsers: users.length
          });
          
          if (userId) {
            // Buscar el usuario completo en la lista
            const fullUser = users.find(u => u.id === userId) as UserWithPermissions;
            
            if (fullUser) {
              console.log('🔍 ✅ Usuario encontrado:', {
                id: fullUser.id,
                name: fullUser.name,
                role: fullUser.Role?.name,
                totalPermissions: fullUser.Role?.Permissions?.length || 0
              });
              
              // Guardar usuario básico
              const basicUser = {
                id: fullUser.id,
                name: fullUser.name,
                email: fullUser.email,
                roleId: fullUser.roleId
              };
              
              setUser(basicUser);
              setUserWithPermissions(fullUser);
              
              console.log('🔍 ✅ Usuario cargado en el store desde token');
            } else {
              console.log('🔍 ❌ Usuario no encontrado en la lista');
            }
          } else {
            console.log('🔍 ❌ No se pudo extraer userId del token');
          }
        } catch (error) {
          console.error('🔍 ❌ Error decodificando token:', error);
        }
        
        console.log('🔍 =================================');
      }
    }
  }, [user, users, setUser, setUserWithPermissions]);
};
