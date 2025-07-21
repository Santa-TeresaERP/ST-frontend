import { CashSessionAttributes } from '../types/cash-session';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { useState } from 'react';
import { CloseCashSessionForm } from './CashSessionForm';

interface CashSessionDetailProps {
  session: CashSessionAttributes;
  showCloseButton?: boolean;
}

export const CashSessionDetail = ({ session, showCloseButton = false }: CashSessionDetailProps) => {
  const [showCloseForm, setShowCloseForm] = useState(false);
  
  // Formatear fecha
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Formatear montos a moneda
  const formatCurrency = (amount?: number | string) => {
    if (amount === undefined || amount === null) return 'N/A';
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(numAmount);
  };

  return (
    <>
      <Card className="p-4 space-y-3">
        <h3 className="text-lg font-semibold mb-2">
          Sesión de Caja {session.status === 'open' ? '(Activa)' : '(Cerrada)'}
        </h3>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm text-gray-500">ID:</p>
            <p className="font-medium">{session.id}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Estado:</p>
            <p className="font-medium">
              {session.status === 'open' ? (
                <span className="text-green-600">Abierta</span>
              ) : (
                <span className="text-red-600">Cerrada</span>
              )}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Fecha de Apertura:</p>
            <p className="font-medium">{formatDate(session.started_at)}</p>
          </div>
          
          {session.ended_at && (
            <div>
              <p className="text-sm text-gray-500">Fecha de Cierre:</p>
              <p className="font-medium">{formatDate(session.ended_at)}</p>
            </div>
          )}
          
          <div>
            <p className="text-sm text-gray-500">Monto Inicial:</p>
            <p className="font-medium">{formatCurrency(session.start_amount)}</p>
          </div>
          
          {session.end_amount !== undefined && (
            <div>
              <p className="text-sm text-gray-500">Monto Final:</p>
              <p className="font-medium">{formatCurrency(session.end_amount)}</p>
            </div>
          )}
          
          {session.total_sales !== undefined && (
            <div>
              <p className="text-sm text-gray-500">Total Ventas:</p>
              <p className="font-medium">{formatCurrency(session.total_sales)}</p>
            </div>
          )}
          
          {session.total_returns !== undefined && (
            <div>
              <p className="text-sm text-gray-500">Total Devoluciones:</p>
              <p className="font-medium">{formatCurrency(session.total_returns)}</p>
            </div>
          )}
        </div>
        
        {showCloseButton && session.status === 'open' && (
          <div className="pt-2">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setShowCloseForm(true)}
            >
              Cerrar Sesión
            </Button>
          </div>
        )}
      </Card>
      
      {showCloseForm && session.id && (
        <CloseCashSessionForm 
          sessionId={session.id} 
          startAmount={typeof session.start_amount === 'string' 
            ? parseFloat(session.start_amount) 
            : session.start_amount} 
          onClose={() => setShowCloseForm(false)} 
        />
      )}
    </>
  );
};
