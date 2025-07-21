import React from 'react';

interface ModalErrorProps {
  message: string;
  onClose: () => void;
}

const ModalError: React.FC<ModalErrorProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center space-y-5 border-t-4 border-red-600">
        <h2 className="text-2xl font-bold text-red-600">¡Atención!</h2>
        <p className="text-gray-700 text-base">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 px-5 py-2 rounded-full bg-gradient-to-r from-red-500 to-red-700 text-white font-medium shadow-md hover:from-red-600 hover:to-red-800 transition-all"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalError;
