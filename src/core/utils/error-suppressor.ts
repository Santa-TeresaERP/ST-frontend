/**
 * Suprime errores 403 de Axios en la consola del navegador
 */
let originalConsoleError: typeof console.error;

export const suppressAxios403Errors = () => {
  if (typeof window === 'undefined') return;
  
  if (!originalConsoleError) {
    originalConsoleError = console.error;
  }
  
  console.error = (...args: unknown[]) => {
    const errorMessage = args.join(' ').toLowerCase();
    
    if (
      errorMessage.includes('request failed with status code 403') ||
      (errorMessage.includes('axioserror') && errorMessage.includes('403')) ||
      (errorMessage.includes('forbidden') && errorMessage.includes('axios'))
    ) {
      return;
    }
    
    originalConsoleError.apply(console, args);
  };
};
