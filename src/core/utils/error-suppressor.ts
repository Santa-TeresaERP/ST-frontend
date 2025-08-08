// 🔥 SUPRESOR DE ERRORES 403 EN CONSOLA

let originalConsoleError: typeof console.error;

export const suppressAxios403Errors = () => {
  if (typeof window === 'undefined') return; // Solo en el cliente
  
  // Guardar la función original si no se ha guardado
  if (!originalConsoleError) {
    originalConsoleError = console.error;
  }
  
  // Sobrescribir console.error para filtrar errores 403 de Axios
  console.error = (...args: unknown[]) => {
    // Convertir argumentos a string para buscar patrones
    const errorMessage = args.join(' ').toLowerCase();
    
    // Si contiene patrones de error 403 de Axios, no mostrar
    if (
      errorMessage.includes('request failed with status code 403') ||
      errorMessage.includes('axioserror') && errorMessage.includes('403') ||
      errorMessage.includes('forbidden') && errorMessage.includes('axios')
    ) {
      // Suprimir este error específico
      return;
    }
    
    // Para todos los demás errores, usar la función original
    originalConsoleError.apply(console, args);
  };
};

export const restoreConsoleError = () => {
  if (originalConsoleError) {
    console.error = originalConsoleError;
  }
};

// 🔥 AUTO-INICIALIZAR EN EL CLIENTE
if (typeof window !== 'undefined') {
  suppressAxios403Errors();
}
