import React, { useState, useMemo } from 'react';
import {
  FiEdit2,
  FiTrash2,
  FiUsers,
  FiSearch,
  FiPlus,
  FiCheckCircle,
} from 'react-icons/fi';
import ModalCreateSupplier from './suppliers/modal-create-supplier';
import ModalEditSupplier from './suppliers/modal-edit-supplier';
import ModalDeleteSupplier from './suppliers/modal-delete-supplier';
import {
  useFetchSuppliers,
  useCreateSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
} from '../../hook/useSuppliers';
import type { Supplier } from '../../types/suppliers';

const SupplierView: React.FC = () => {
  const { data: suppliers = [], isLoading, error } = useFetchSuppliers();
  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const filteredSuppliers = useMemo(
    () =>
      suppliers.filter((s) =>
        [s.suplier_name, s.contact_name]
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(s.ruc).includes(searchTerm)
      ),
    [suppliers, searchTerm]
  );

  const handleCreateSupplier = (nuevo: {
    nombre: string;
    ruc: string;
    contacto: string;
    correo: string;
    direccion: string;
    telefono: string;
  }) => {
    if (
      !nuevo.nombre ||
      !nuevo.ruc ||
      !nuevo.contacto ||
      !nuevo.correo ||
      !nuevo.direccion ||
      !nuevo.telefono
    ) {
      setFormError('Todos los campos son obligatorios');
      return;
    }
    setFormError(null);
    createSupplier.mutate(
      {
        suplier_name: nuevo.nombre,
        ruc: Number(nuevo.ruc),
        contact_name: nuevo.contacto,
        email: nuevo.correo,
        address: nuevo.direccion,
        phone: Number(nuevo.telefono),
      },
      {
        onError: (err: any) => {
          setFormError(
            err.response?.data?.message ?? err.message ?? 'Error desconocido'
          );
        },
        onSuccess: () => setIsCreateModalOpen(false),
      }
    );
  };

  const handleUpdateSupplier = (data: {
    nombre: string;
    ruc: string;
    contacto: string;
    correo: string;
    direccion: string;
    telefono: string;
  }) => {
    if (!supplierToEdit) return;
    updateSupplier.mutate({
      id: supplierToEdit.id!,
      payload: {
        suplier_name: data.nombre,
        ruc: Number(data.ruc),
        contact_name: data.contacto,
        email: data.correo,
        address: data.direccion,
        phone: Number(data.telefono),
      },
    });
    setSupplierToEdit(null);
  };

  const toggleStatus = (id: string, newStatus: boolean) => {
    deleteSupplier.mutate({ id, status: newStatus });
  };

  return (
    <>
      <div className="p-6 space-y-4 bg-gray-50 min-h-screen">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-3xl font-semibold text-green-700">Proveedores</h2>
          <button
            onClick={() => {
              setFormError(null);
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition"
          >
            <FiPlus /> Nuevo
          </button>
        </header>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:w-1/3">
            <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar nombre, RUC o contacto"
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                {['Nombre', 'RUC', 'Contacto', 'Teléfono', 'Correo', 'Dirección', 'Estado', 'Acciones'].map(
                  (t) => (
                    <th key={t} className="px-4 py-2 text-center">
                      {t}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-4 text-center text-gray-500">
                    Cargando...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="py-4 text-center text-red-500">
                    Error al cargar
                  </td>
                </tr>
              ) : filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-4 text-center text-gray-500">
                    {searchTerm
                      ? 'No se encontraron resultados'
                      : 'Sin proveedores'}
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 border-t">
                    <td className="px-4 py-2">{s.suplier_name}</td>
                    <td className="px-4 py-2">{s.ruc}</td>
                    <td className="px-4 py-2">{s.contact_name}</td>
                    <td className="px-4 py-2">{s.phone}</td>
                    <td className="px-4 py-2">{s.email}</td>
                    <td className="px-4 py-2">{s.address}</td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          s.status
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {s.status ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-2 flex justify-center gap-2">
                      <button
                        onClick={() => setSupplierToEdit(s)}
                        className="text-blue-600 hover:text-blue-800"
                        aria-label={`Editar ${s.suplier_name}`}
                      >
                        <FiEdit2 size={18} />
                      </button>
                      {s.status ? (
                        <button
                          onClick={() => toggleStatus(s.id!, false)}
                          className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition"
                          aria-label={`Inactivar ${s.suplier_name}`}
                        >
                          <FiTrash2 size={16} />
                          <span className="text-sm">Inactivar</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleStatus(s.id!, true)}
                          className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition"
                          aria-label={`Reactivar ${s.suplier_name}`}
                        >
                          <FiCheckCircle size={16} />
                          <span className="text-sm">Reactivar</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isCreateModalOpen && (
        <ModalCreateSupplier
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateSupplier}
          error={formError}
        />
      )}

      {supplierToEdit && (
        <ModalEditSupplier
          onClose={() => setSupplierToEdit(null)}
          initialData={{
            nombre: supplierToEdit.suplier_name,
            ruc: String(supplierToEdit.ruc ?? ''),
            contacto: supplierToEdit.contact_name,
            correo: supplierToEdit.email,
            direccion: supplierToEdit.address,
            telefono: String(supplierToEdit.phone ?? ''),
          }}
          onUpdate={handleUpdateSupplier}
        />
      )}
    </>
  );
};

export default SupplierView;
