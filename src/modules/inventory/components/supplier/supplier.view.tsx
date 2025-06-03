import React, { useState, useMemo } from 'react';
import { FiEdit2, FiTrash2, FiUsers, FiSearch, FiPlus } from 'react-icons/fi';
import ModalCreateSupplier from './suppliers/modal-create-supplier';
import ModalEditSupplier from './suppliers/modal-edit-supplier';
import ModalDeleteSupplier from './suppliers/modal-delete-supplier';

type Supplier = {
  id: number;
  nombre: string;
  contacto: string;
  ruc: string;
  telefono: string;
  correo: string;
  direccion: string;
};

const initialSuppliers: Supplier[] = [
  { id: 1, nombre: 'Constructora Andes', contacto: 'Juan Hernández', ruc: '201234567', telefono: '987654321', correo: 'andes@example.com', direccion: 'Av. Principal 123' },
  { id: 2, nombre: 'Proveedores S.A.', contacto: 'María López', ruc: '204567890', telefono: '912345678', correo: 'proveedores@example.com', direccion: 'Jr. Comercio 456' },
];

const SupplierView: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier =>
      supplier.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.ruc.includes(searchTerm) ||
      supplier.contacto.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [suppliers, searchTerm]);

  const handleCreateSupplier = (nuevoProveedor: Omit<Supplier, 'id'>) => {
    const nuevo: Supplier = {
      id: suppliers.length > 0 ? Math.max(...suppliers.map(s => s.id)) + 1 : 1,
      ...nuevoProveedor,
    };
    setSuppliers(prev => [...prev, nuevo]);
    setIsCreateModalOpen(false);
  };

  const handleEdit = (id: number) => {
    const supplier = suppliers.find(s => s.id === id);
    if (supplier) {
      setSupplierToEdit(supplier);
    }
  };

  const handleUpdateSupplier = (data: Omit<Supplier, 'id'>) => {
    if (supplierToEdit) {
      const actualizado: Supplier = { ...supplierToEdit, ...data };
      setSuppliers(prev =>
        prev.map(s => (s.id === actualizado.id ? actualizado : s))
      );
      setSupplierToEdit(null);
    }
  };

  const handleDelete = (id: number) => {
    const supplier = suppliers.find(s => s.id === id);
    if (supplier) setSupplierToDelete(supplier);
  };

  const confirmDelete = () => {
    if (supplierToDelete) {
      setSuppliers(prev => prev.filter(s => s.id !== supplierToDelete.id));
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
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition flex items-center gap-2"
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
            <thead className="bg-emerald-600 text-white">
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
              {filteredSuppliers.length === 0 ? (
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
                    <td className="px-4 py-2">{s.nombre}</td>
                    <td className="px-4 py-2">{s.ruc}</td>
                    <td className="px-4 py-2">{s.contacto}</td>
                    <td className="px-4 py-2">{s.telefono}</td>
                    <td className="px-4 py-2">{s.correo}</td>
                    <td className="px-4 py-2">{s.direccion}</td>
                    <td className="px-4 py-2 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(s.id)}
                        className="text-blue-600 hover:text-blue-800"
                        aria-label={`Editar proveedor ${s.nombre}`}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-red-600 hover:text-red-800"
                        aria-label={`Eliminar proveedor ${s.nombre}`}
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
        />
      )}

      {/* Modal para editar */}
      {supplierToEdit && (
        <ModalEditSupplier
          onClose={() => setSupplierToEdit(null)}
          initialData={{
            nombre: supplierToEdit.nombre,
            ruc: supplierToEdit.ruc,
            contacto: supplierToEdit.contacto,
            correo: supplierToEdit.correo,
            direccion: supplierToEdit.direccion,
            telefono: supplierToEdit.telefono,
          }}
          onUpdate={handleUpdateSupplier}
        />
      )}

      {/* Modal para eliminar */}
      <ModalDeleteSupplier
        isOpen={!!supplierToDelete}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        supplierName={supplierToDelete?.nombre}
      />
    </>
  );
};

export default SupplierView;
