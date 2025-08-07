'use client'

import { ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

interface ReactQueryProviderProps {
  children: ReactNode
}

const ReactQueryProvider = ({ children }: ReactQueryProviderProps) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          // 🔥 NO REINTENTAR EN ERRORES 403 (Sin permisos)
          if (error.message.includes('403') || error.message.includes('Forbidden')) {
            return false;
          }
          return failureCount < 3;
        },
      },
      mutations: {
        retry: (failureCount, error) => {
          // 🔥 NO REINTENTAR EN ERRORES 403 (Sin permisos) 
          if (error.message.includes('403') || error.message.includes('Forbidden')) {
            return false;
          }
          return failureCount < 3;
        },
        // 🔥 NO MOSTRAR ERRORES 403 EN CONSOLA POR DEFECTO
        onError: (error) => {
          if (!error.message.includes('403') && !error.message.includes('Forbidden')) {
            console.error('Mutation error:', error);
          }
        }
      }
    }
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default ReactQueryProvider
