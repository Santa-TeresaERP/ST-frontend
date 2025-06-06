import React from 'react';
// Verified Icons import path
import { Trash2, X, Loader2 } from 'lucide-react'; 
// Verified UI component import paths
import { Button } from '@/app/components/ui/button'; 
// Corrected import: Use Dialog component which exists
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/app/components/ui/dialog"; // Use existing dialog.tsx

interface ModalDeleteResourceProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>; // Make confirm async
  resourceName?: string;
  isDeleting: boolean; // Add loading state
}

const ModalDeleteResource: React.FC<ModalDeleteResourceProps> = ({
  isOpen,
  onClose,
  onConfirm,
  resourceName,
  isDeleting,
}) => {

  const handleConfirm = async () => {
    await onConfirm();
    // Parent should handle closing on success
  };

  // Using verified Dialog component (corrected from AlertDialog)
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* Use DialogContent */}
      <DialogContent className="dark:bg-gray-800 sm:max-w-[425px]">
        {/* Use DialogHeader */}
        <DialogHeader>
          {/* Use DialogTitle */}
          <DialogTitle className="flex flex-col items-center text-center dark:text-white">
            {/* Using verified Icon */}
            <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-3 mb-3">
              <Trash2 size={24} className="text-red-600 dark:text-red-400" />
            </div>
            Eliminar Recurso
          </DialogTitle>
          {/* Use DialogDescription */}
          <DialogDescription className="text-center dark:text-gray-400 pt-2">
            ¿Estás seguro de que deseas eliminar el recurso "<strong>{resourceName || 'seleccionado'}</strong>"?
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        {/* Use DialogFooter */}
        <DialogFooter className="mt-4 sm:justify-center">
          {/* Use standard Button for Cancel */}
          <Button variant="ghost" onClick={onClose} disabled={isDeleting} className="dark:text-gray-300 dark:hover:bg-gray-700">
            Cancelar
          </Button>
          {/* Use standard Button for Confirm */}
          <Button 
            variant="destructive" 
            onClick={handleConfirm} 
            disabled={isDeleting}
            className="bg-red-700 hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                {/* Using verified Icon */}
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                {/* Using verified Icon */}
                <Trash2 size={18} className="mr-2"/> Eliminar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDeleteResource;

