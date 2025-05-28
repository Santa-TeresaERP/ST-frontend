import React, { useState, useMemo } from 'react';
import { FiEdit2, FiTrash2, FiUsers, FiSearch, FiPlus } from 'react-icons/fi';

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
  { id: 1, nombre: 'Constructora Andes', contacto: 'Juan Hernández', ruc: '20123456789', telefono: '987654321', correo: 'andes@example.com', direccion: 'Av. Principal 123' },
  { id: 2, nombre: 'Proveedores S.A.', contacto: 'María López', ruc: '20456789012', telefono: '912345678', correo: 'proveedores@example.com', direccion: 'Jr. Comercio 456' },
];

const SupplierView: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier =>
      supplier.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.ruc.includes(searchTerm) ||
      supplier.contacto.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [suppliers, searchTerm]);

  const handleEdit = (id: number) => {
    const item = suppliers.find((s) => s.id === id);
    if (item) setSupplierToEdit(item);
  };

  const handleDelete = (id: number) => {
    const item = suppliers.find((s) => s.id === id);
    if (item) setSupplierToDelete(item);
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

  const handleCreateSupplier = (nuevoProveedor: Omit<Supplier, 'id'>) => {
    const nuevo: Supplier = {
      id: suppliers.length > 0 ? Math.max(...suppliers.map(s => s.id)) + 1 : 1,
      ...nuevoProveedor,
    };
    setSuppliers(prev => [...prev, nuevo]);
    setIsModalOpen(false);
  };

  const handleUpdateSupplier = (proveedorActualizado: Supplier) => {
    setSuppliers(prev =>
      prev.map(s => s.id === proveedorActualizado.id ? proveedorActualizado : s)
    );
    setSupplierToEdit(null);
  };

  return (
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
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition flex items-center gap-2"
        >
          <FiPlus /> Agregar Proveedor
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="Buscar proveedores por nombre, contacto o RUC..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">RUC</th>
              <th className="px-4 py-2 text-left">Contacto</th> {/* Aquí el contacto */}
              <th className="px-4 py-2 text-left">Teléfono</th>
              <th className="px-4 py-2 text-left">Correo</th>
              <th className="px-4 py-2 text-left">Dirección</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  {searchTerm ? 'No se encontraron proveedores que coincidan con la búsqueda' : 'No hay proveedores para mostrar.'}
                </td>
              </tr>
            ) : (
              filteredSuppliers.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 border-t">
                  <td className="px-4 py-2 text-left">{s.nombre}</td>
                  <td className="px-4 py-2 text-left">{s.ruc}</td>
                  <td className="px-4 py-2 text-left">{s.contacto}</td> {/* Mostrar contacto */}
                  <td className="px-4 py-2 text-left">{s.telefono}</td>
                  <td className="px-4 py-2 text-left">{s.correo}</td>
                  <td className="px-4 py-2 text-left">{s.direccion}</td>
                  <td className="px-4 py-2 text-left space-x-2">
                    <button
                      onClick={() => handleEdit(s.id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
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
  );
};

export default SupplierView;
