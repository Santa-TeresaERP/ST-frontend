/**
 * Suprime errores 403 de Axios en la consola del navegador
 * Útil para evitar spam de errores cuando se verifica permisos automáticamente
 */
let originalConsoleError: typeof console.error;

export const suppressAxios403Errors = () => {
  // Solo funciona en el navegador
  if (typeof window === 'undefined') return;
  
  // Guardar la función original de console.error
  if (!originalConsoleError) {
    originalConsoleError = console.error;
  }
  
  // Sobrescribir console.error para filtrar errores 403
  console.error = (...args: unknown[]) => {
    const errorMessage = args.join(' ').toLowerCase();
    
    // Filtrar errores relacionados con 403 (Forbidden)
    if (
      errorMessage.includes('request failed with status code 403') ||
      (errorMessage.includes('axioserror') && errorMessage.includes('403')) ||
      (errorMessage.includes('forbidden') && errorMessage.includes('axios'))
    ) {
      return; // No mostrar estos errores
    }
    
    // Mostrar todos los demás errores normalmente
    originalConsoleError.apply(console, args);
  };
};
