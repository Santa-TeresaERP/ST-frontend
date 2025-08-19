import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { ShieldAlert, Lock } from 'lucide-react';

/**
 * Modal que se muestra cuando el usuario no tiene permisos para una acción
 * Proporciona información clara sobre por qué se denegó el acceso
 */
interface AccessDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;     // Título del modal
  message?: string;   // Mensaje principal
  action?: string;    // Acción que se intentó realizar
  module?: string;    // Módulo donde ocurrió el error
}

const AccessDeniedModal: React.FC<AccessDeniedModalProps> = ({
  isOpen,
  onClose,
  title = 'Acceso Restringido',
  message = 'No tienes permisos para realizar esta acción.',
  action = 'esta acción',
  module = 'este módulo'
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[90%] sm:max-w-[425px] px-4 py-6 mx-auto rounded-xl shadow-lg border-0">
        {/* Header con diseño de alerta */}
        <div className="-mt-6 -mx-4 rounded-t-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-white text-xl font-semibold">
              <ShieldAlert className="h-6 w-6" />
              {title}
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Contenido principal del modal */}
        <div className="flex flex-col items-center text-center space-y-4 mt-4">
          {/* Icono de acceso denegado */}
          <div className="bg-red-100 p-4 rounded-full">
            <Lock className="h-12 w-12 text-red-600" />
          </div>

          {/* Mensajes informativos */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Sin Permisos Suficientes
            </h3>
            <p className="text-gray-600 text-sm">
              {message}
            </p>
            <p className="text-gray-500 text-xs">
              Contacta al administrador del sistema si necesitas acceso a {module}.
            </p>
          </div>

          {/* Información adicional para debugging */}
          <div className="bg-gray-50 p-3 rounded-lg w-full">
            <div className="text-xs text-gray-600">
              <p><span className="font-medium">Módulo:</span> {module}</p>
              <p><span className="font-medium">Acción:</span> {action}</p>
              {/* Sugerencia especial para permisos revocados */}
              {action.includes('revocados') && (
                <p className="text-orange-600 font-medium mt-1">
                  💡 Sugerencia: Recarga la página para actualizar tus permisos
                </p>
              )}
            </div>
          </div>

          {/* Botón para cerrar el modal */}
          <Button
            onClick={onClose}
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-3xl mt-4"
          >
            Entendido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccessDeniedModal;
