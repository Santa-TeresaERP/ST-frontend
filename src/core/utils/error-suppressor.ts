/**
 * Suprime errores 403 de Axios en la consola del navegador
 * Útil para evitar spam de errores cuando se verifica permisos automáticamente
 */
let originalConsoleError: typeof console.error;
let originalConsoleWarn: typeof console.warn;
let suppressionActive = false;

export const suppressAxios403Errors = () => {
  // Solo funciona en el navegador y solo activar una vez
  if (typeof window === 'undefined' || suppressionActive) return;
  
  suppressionActive = true;
  
  // Guardar las funciones originales
  if (!originalConsoleError) {
    originalConsoleError = console.error;
    originalConsoleWarn = console.warn;
  }
  
  // Función mejorada para detectar errores 403 de módulos
  const is403ModuleError = (args: unknown[]) => {
    const fullMessage = args.join(' ').toLowerCase();
    
    // Detectar patrones específicos del error que vemos
    return (
      // Error principal que aparece
      fullMessage.includes('get http://localhost:3005/modules 403 (forbidden)') ||
      // Otros patrones relacionados
      (fullMessage.includes('403') && fullMessage.includes('modules')) ||
      (fullMessage.includes('forbidden') && fullMessage.includes('modules')) ||
      // Patrones de Axios/XHR
      (fullMessage.includes('xhr.js') && fullMessage.includes('403')) ||
      (fullMessage.includes('dispatchxhrrequest') && fullMessage.includes('403')) ||
      // Patrón del stack trace
      fullMessage.includes('error-suppressor.ts:70') ||
      // Request failed patterns
      fullMessage.includes('request failed with status code 403')
    );
  };
  
  // Sobrescribir console.error de manera más agresiva
  console.error = (...args: unknown[]) => {
    // Si es un error 403 de módulos, no hacer nada
    if (is403ModuleError(args)) {
      return;
    }
    
    // Para todos los demás errores, usar la función original
    originalConsoleError.apply(console, args);
  };
  
  // Sobrescribir console.warn también
  console.warn = (...args: unknown[]) => {
    if (is403ModuleError(args)) {
      return;
    }
    
    originalConsoleWarn.apply(console, args);
  };
  
  // Intentar interceptar a nivel de window.onerror también
  const originalWindowError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    const msgStr = String(message).toLowerCase();
    if (msgStr.includes('403') && msgStr.includes('modules')) {
      return true; // Suprimir el error
    }
    
    if (originalWindowError) {
      return originalWindowError(message, source, lineno, colno, error);
    }
    return false;
  };
};

/**
 * Restaura las funciones originales de console
 */
export const restoreConsole = () => {
  if (originalConsoleError) {
    console.error = originalConsoleError;
    suppressionActive = false;
  }
  if (originalConsoleWarn) {
    console.warn = originalConsoleWarn;
  }
};
