import React, { useState, useMemo } from 'react';
import { FiEdit2, FiTrash2, FiUsers, FiSearch, FiPlus } from 'react-icons/fi';
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

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) =>
      (supplier?.suplier_name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
      (supplier?.ruc ? String(supplier.ruc).includes(searchTerm) : false) ||
      (supplier?.contact_name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
    );
  }, [suppliers, searchTerm]);

  // Crear proveedor desde el modal
  const handleCreateSupplier = (nuevoProveedor: {
    nombre: string;
    ruc: string;
    contacto: string;
    correo: string;
    direccion: string;
    telefono: string;
  }) => {
    // Validación simple
    if (
      !nuevoProveedor.nombre ||
      !nuevoProveedor.ruc ||
      !nuevoProveedor.contacto ||
      !nuevoProveedor.correo ||
      !nuevoProveedor.direccion ||
      !nuevoProveedor.telefono
    ) {
      setFormError('Todos los campos son obligatorios');
      return;
    }
    setFormError(null);

    // Type guard para error con response.data.message
    function isAxiosError(err: unknown): err is { response: { data: { message: string } } } {
      return (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: unknown }).response === 'object' &&
        (err as { response: { data?: unknown } }).response !== null &&
        'data' in (err as { response: { data?: unknown } }).response &&
        typeof ((err as { response: { data: { message?: unknown } } }).response.data as { message?: unknown }).message === 'string'
      );
    }

    // Type guard para error con message
    function isErrorWithMessage(err: unknown): err is { message: string } {
      return (
        typeof err === 'object' &&
        err !== null &&
        'message' in err &&
        typeof (err as { message?: unknown }).message === 'string'
      );
    }

    createSupplier.mutate(
      {
        suplier_name: nuevoProveedor.nombre, // <--- Cambiado aquí
        ruc: Number(nuevoProveedor.ruc),
        contact_name: nuevoProveedor.contacto,
        email: nuevoProveedor.correo,
        address: nuevoProveedor.direccion,
        phone: Number(nuevoProveedor.telefono),
      },
      {
        onError: (error: unknown) => {
          let msg = 'Error al crear proveedor: ';
          if (isAxiosError(error)) {
            msg += error.response.data.message;
          } else if (isErrorWithMessage(error)) {
            msg += error.message;
          } else {
            msg += 'Verifica los datos';
          }
          setFormError(msg);
        },
        onSuccess: () => {
          setIsCreateModalOpen(false);
        },
      }
    );
  };

  // Editar proveedor
  const handleEdit = (id: string) => {
    const supplier = suppliers.find((s) => s.id === id);
    if (supplier) {
      setSupplierToEdit(supplier);
    }
  };

  // Actualizar proveedor
  const handleUpdateSupplier = (data: {
    nombre: string;
    ruc: string;
    contacto: string;
    correo: string;
    direccion: string;
    telefono: string;
  }) => {
    if (supplierToEdit) {
      updateSupplier.mutate({
        id: supplierToEdit.id!,
        payload: {
          suplier_name: data.nombre, // <--- Cambiado aquí
          ruc: Number(data.ruc),
          contact_name: data.contacto,
          email: data.correo,
          address: data.direccion,
          phone: Number(data.telefono),
        },
      });
      setSupplierToEdit(null);
    }
  };

  // Eliminar proveedor
  const handleDelete = (id: string) => {
    const supplier = suppliers.find((s) => s.id === id);
    if (supplier) setSupplierToDelete(supplier);
  };

  const confirmDelete = () => {
    if (supplierToDelete) {
      deleteSupplier.mutate(supplierToDelete.id!);
      setSupplierToDelete(null);
    }
  };

  const cancelDelete = () => {
    setSupplierToDelete(null);
  };

  return (
    <>
      <div className="p-6 space-y-4 bg-gray-50 min-h-screen">
        <div className="flex justify-start">
          <h2 className="text-4xl font-semibold text-emerald-600">Proveedores</h2>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FiUsers size={24} className="text-emerald-600" />
            <span className="text-lg font-medium">Gestión de Proveedores</span>
          </div>

          <button
            onClick={() => {
              setFormError(null);
              setIsCreateModalOpen(true);
            }}
            className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition flex items-center gap-2"
          >
            <FiPlus /> Nuevo Proveedor
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre, RUC o contacto"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-2 text-center">Nombre</th>
                <th className="px-4 py-2 text-center">RUC</th>
                <th className="px-4 py-2 text-center">Contacto</th>
                <th className="px-4 py-2 text-center">Teléfono</th>
                <th className="px-4 py-2 text-center">Correo</th>
                <th className="px-4 py-2 text-center">Dirección</th>
                <th className="px-4 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    Cargando proveedores...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-red-500">
                    Error al cargar proveedores
                  </td>
                </tr>
              ) : filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    {searchTerm
                      ? 'No se encontraron proveedores que coincidan con la búsqueda'
                      : 'No hay proveedores para mostrar.'}
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 border-t">
                    <td className="px-4 py-2">{s.suplier_name ?? ''}</td>
                    <td className="px-4 py-2">{s.ruc ?? ''}</td>
                    <td className="px-4 py-2">{s.contact_name ?? ''}</td>
                    <td className="px-4 py-2">{s.phone ?? ''}</td>
                    <td className="px-4 py-2">{s.email ?? ''}</td>
                    <td className="px-4 py-2">{s.address ?? ''}</td>
                    <td className="px-4 py-2 flex justify-center gap-2">
                      <button
                        onClick={() => s.id && handleEdit(s.id)}
                        className="text-blue-600 hover:text-blue-800"
                        aria-label={`Editar proveedor ${s.suplier_name}`}
                        disabled={!s.id}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => s.id && handleDelete(s.id)}
                        className="text-red-600 hover:text-red-800"
                        aria-label={`Eliminar proveedor ${s.suplier_name}`}
                        disabled={!s.id}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear */}
      {isCreateModalOpen && (
        <ModalCreateSupplier
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateSupplier}
          error={formError}
        />
      )}

      {/* Modal para editar */}
      {supplierToEdit && (
        <ModalEditSupplier
          onClose={() => setSupplierToEdit(null)}
          initialData={{
            nombre: supplierToEdit.suplier_name,
            ruc: supplierToEdit.ruc ? String(supplierToEdit.ruc) : '',
            contacto: supplierToEdit.contact_name,
            correo: supplierToEdit.email,
            direccion: supplierToEdit.address,
            telefono: supplierToEdit.phone ? String(supplierToEdit.phone) : '',
          }}
          onUpdate={handleUpdateSupplier}
        />
      )}

      {/* Modal para eliminar */}
      <ModalDeleteSupplier
        isOpen={!!supplierToDelete}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        supplierName={supplierToDelete?.suplier_name}
      />
    </>
  );
};

export default SupplierView;