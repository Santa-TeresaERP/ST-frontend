import React, { useState } from 'react';
import { X, Save, UserPlus } from 'lucide-react';

type ModalCreateSupplierProps = {
  onClose: () => void;
  onCreate: (proveedor: {
    nombre: string;
    ruc: string;
    contacto: string;
    correo: string;
    direccion: string;
    telefono: string;
  }) => void;
};

const ModalCreateSupplier: React.FC<ModalCreateSupplierProps> = ({
  onClose,
  onCreate,
}) => {
  const [nombre, setNombre] = useState('');
  const [ruc, setRuc] = useState('');
  const [contacto, setContacto] = useState('');
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState('');

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidRuc = (ruc: string) => /^\d{1,9}$/.test(ruc);

  const isValidTelefono = (tel: string) => /^\d{7,15}$/.test(tel);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    if (!ruc.trim()) {
      setError('El RUC es obligatorio.');
      return;
    }
    if (!isValidRuc(ruc.trim())) {
      setError('El RUC debe tener máximo 9 dígitos numéricos.');
      return;
    }
    if (!contacto.trim()) {
      setError('El contacto es obligatorio.');
      return;
    }
    if (!correo.trim()) {
      setError('El correo es obligatorio.');
      return;
    }
    if (!isValidEmail(correo.trim())) {
      setError('El correo debe ser válido.');
      return;
    }
    if (!direccion.trim()) {
      setError('La dirección es obligatoria.');
      return;
    }
    if (!telefono.trim()) {
      setError('El teléfono es obligatorio.');
      return;
    }
    if (!isValidTelefono(telefono.trim())) {
      setError('El teléfono debe tener entre 7 y 15 dígitos numéricos.');
      return;
    }

    setError('');
    onCreate({
      nombre: nombre.trim(),
      ruc: ruc.trim(),
      contacto: contacto.trim(),
      correo: correo.trim(),
      direccion: direccion.trim(),
      telefono: telefono.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl relative">
        <div className="bg-emerald-600 text-white p-5 rounded-t-2xl flex items-center justify-center relative gap-2">
          <UserPlus size={26} />
          <h2 className="text-2xl font-semibold text-center">Nuevo Proveedor</h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
          {error && (
            <p className="text-sm text-red-600 font-medium">{error}</p>
          )}

          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Nombre*
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                placeholder="Nombre del proveedor"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Contacto*
              </label>
              <input
                type="text"
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-600  focus:outline-none"
                placeholder="Nombre de contacto"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                RUC* 
              </label>
              <input
                type="text"
                maxLength={11}
                value={ruc}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d{0,9}$/.test(val)) {
                    setRuc(val);
                  }
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-600  focus:outline-none"
                placeholder="Número de RUC"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Correo*
              </label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-600  focus:outline-none"
                placeholder="Correo electrónico"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Dirección*
              </label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-600  focus:outline-none"
                placeholder="Dirección del proveedor"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Teléfono*
              </label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) {
                    setTelefono(val);
                  }
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                placeholder="Número de teléfono"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center gap-2"
            >
              <Save size={18} /> Aceptar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateSupplier;
