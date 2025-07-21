// Utilidades para validar el estado de las tiendas
import { StoreAttributes } from '@/modules/stores/types/store.d';

export interface StoreValidationResult {
  isEnabled: boolean;
  reason?: string;
  warning?: string;
}

/**
 * Determina si una tienda está habilitada para ser utilizada
 * 
 * Una tienda se considera habilitada si:
 * 1. Existe (no es null/undefined)
 * 2. Tiene información básica completa (nombre y dirección)
 * 3. Su status está en true (activa)
 * 
 * @param store - La tienda a validar
 * @returns Resultado de la validación con información de estado
 */
export const validateStoreStatus = (store: StoreAttributes | null | undefined): StoreValidationResult => {
  // Validaciones básicas
  if (!store) {
    return {
      isEnabled: false,
      reason: 'Tienda no encontrada'
    };
  }

  if (!store.store_name || store.store_name.trim() === '') {
    return {
      isEnabled: false,
      reason: 'La tienda no tiene nombre configurado'
    };
  }

  if (!store.address || store.address.trim() === '') {
    return {
      isEnabled: false,
      reason: 'La tienda no tiene dirección configurada'
    };
  }

  // Verificar el status de la tienda
  if (store.status === false) {
    return {
      isEnabled: false,
      reason: 'La tienda está deshabilitada'
    };
  }

  // Si pasa todas las validaciones, está habilitada
  return {
    isEnabled: true,
    warning: 'Tienda disponible para usar'
  };
};

/**
 * Filtrar solo tiendas habilitadas de una lista
 * @param stores - Lista de tiendas
 * @returns Lista de tiendas habilitadas
 */
export const getEnabledStores = (stores: StoreAttributes[]): StoreAttributes[] => {
  return stores.filter(store => validateStoreStatus(store).isEnabled);
};

/**
 * Obtener mensaje de advertencia para mostrar al usuario
 * @param store - La tienda a validar
 * @returns Mensaje de advertencia o null si no hay problemas
 */
export const getStoreWarningMessage = (store: StoreAttributes | null | undefined): string | null => {
  const validation = validateStoreStatus(store);
  
  if (!validation.isEnabled) {
    return `⚠️ Esta tienda no puede ser utilizada: ${validation.reason}`;
  }
  
  return null;
};

/**
 * Verificar si hay tiendas disponibles para usar
 * @param stores - Lista de tiendas
 * @returns true si hay al menos una tienda habilitada
 */
export const hasAvailableStores = (stores: StoreAttributes[]): boolean => {
  return getEnabledStores(stores).length > 0;
};
