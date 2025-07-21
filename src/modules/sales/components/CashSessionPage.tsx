import { useState } from 'react';
import { 
  useFetchActiveCashSession, 
  useFetchCashSessionHistory 
} from '../hooks/useCashSession';
import { OpenCashSessionForm } from '../components/CashSessionForm';
import { CashSessionDetail } from '../components/CashSessionDetail';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

interface CashSessionPageProps {
  storeId: string;
}

export default function CashSessionPage({ storeId }: CashSessionPageProps) {
  const [showOpenForm, setShowOpenForm] = useState(false);
  
  const { 
    data: activeSession, 
    isLoading: isLoadingActive,
    error: activeError
  } = useFetchActiveCashSession(storeId);
  
  const {
    data: sessionHistory,
    isLoading: isLoadingHistory,
    error: historyError
  } = useFetchCashSessionHistory(storeId);

  if (isLoadingActive) {
    return <div className="flex justify-center p-6">Cargando sesión activa...</div>;
  }

  if (activeError) {
    return (
      <Card className="p-4 bg-red-50 border-red-200 mb-4">
        <p className="text-red-600">Error al cargar la sesión: {activeError.message}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Administración de Caja</h1>
        
        {!activeSession && !showOpenForm && (
          <Button onClick={() => setShowOpenForm(true)}>
            Abrir Nueva Sesión
          </Button>
        )}
      </div>
      
      {showOpenForm && !activeSession && (
        <Card className="p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Abrir Nueva Sesión de Caja</h2>
          <OpenCashSessionForm storeId={storeId} />
          <div className="mt-3">
            <Button variant="outline" onClick={() => setShowOpenForm(false)}>
              Cancelar
            </Button>
          </div>
        </Card>
      )}
      
      {activeSession && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Sesión Activa</h2>
          <CashSessionDetail session={activeSession} showCloseButton={true} />
        </div>
      )}
      
      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">Historial de Sesiones</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="py-4">
          {isLoadingHistory ? (
            <div className="flex justify-center p-6">Cargando historial...</div>
          ) : historyError ? (
            <Card className="p-4 bg-red-50 border-red-200">
              <p className="text-red-600">Error al cargar historial: {historyError.message}</p>
            </Card>
          ) : sessionHistory && sessionHistory.length > 0 ? (
            <div className="space-y-4">
              {sessionHistory
                .filter(session => session.id !== activeSession?.id)
                .map(session => (
                  <CashSessionDetail key={session.id} session={session} />
                ))}
            </div>
          ) : (
            <Card className="p-4 bg-gray-50">
              <p className="text-gray-600">No hay historial de sesiones para mostrar.</p>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="stats" className="py-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Estadísticas de Caja</h3>
            {sessionHistory && sessionHistory.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-600">Total Sesiones</p>
                  <p className="text-2xl font-bold">{sessionHistory.length}</p>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-600">Total Ventas</p>
                  <p className="text-2xl font-bold">
                    {new Intl.NumberFormat('es-PE', { 
                      style: 'currency', 
                      currency: 'PEN' 
                    }).format(
                      sessionHistory.reduce((sum, session) => {
                        const sales = typeof session.total_sales === 'string' 
                          ? parseFloat(session.total_sales || '0') 
                          : (session.total_sales || 0);
                        return sum + sales;
                      }, 0)
                    )}
                  </p>
                </div>
                
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-sm text-red-600">Total Devoluciones</p>
                  <p className="text-2xl font-bold">
                    {new Intl.NumberFormat('es-PE', { 
                      style: 'currency', 
                      currency: 'PEN' 
                    }).format(
                      sessionHistory.reduce((sum, session) => {
                        const returns = typeof session.total_returns === 'string' 
                          ? parseFloat(session.total_returns || '0') 
                          : (session.total_returns || 0);
                        return sum + returns;
                      }, 0)
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No hay datos para mostrar estadísticas.</p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
