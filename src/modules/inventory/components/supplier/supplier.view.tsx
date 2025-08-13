import React, { useState, useMemo } from 'react';
import {
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiPlus,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import ModalCreateSupplier from './suppliers/modal-create-supplier';
import ModalEditSupplier from './suppliers/modal-edit-supplier';
import {
  useFetchSuppliers,
  useCreateSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
} from '../../hook/useSuppliers';
import type { Supplier } from '../../types/suppliers';

// 🔥 IMPORTAR SISTEMA DE PERMISOS OPTIMIZADO
import { useModulePermissions } from '@/core/utils/permission-hooks';
import { MODULE_NAMES } from '@/core/utils/useModulesMap';

const SupplierView: React.FC = () => {
  const { data: suppliers = [], isLoading, error } = useFetchSuppliers();
  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();

  // 🔥 USAR HOOK OPTIMIZADO DE PERMISOS - UNA SOLA LLAMADA
  const { canCreate, canEdit, canDelete, isAdmin } = useModulePermissions(MODULE_NAMES.INVENTORY);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Puedes cambiarlo

  const filteredSuppliers = useMemo(
    () =>
      suppliers.filter((s) =>
        [s.suplier_name, s.contact_name]
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) || String(s.ruc).includes(searchTerm)
      ),
    [suppliers, searchTerm]
  );

  const totalItems = filteredSuppliers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedSuppliers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSuppliers.slice(startIndex, endIndex);
  }, [filteredSuppliers, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (startPage > 1) {
      pageNumbers.push(1, '...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      pageNumbers.push('...', totalPages);
    }
    
    return pageNumbers;
  };

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
        onError: (err: Error) => {
          setFormError(
            err.message ?? 'Error desconocido'
          );
        },
        onSuccess: () => {
          setIsCreateModalOpen(false);
          setCurrentPage(1); 
        },
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
          
          {/* 🔥 BOTÓN DE CREAR - SOLO SI TIENE PERMISOS */}
          {(canCreate || isAdmin) && (
            <button
              onClick={() => {
                setFormError(null);
                setIsCreateModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition"
            >
              <FiPlus /> Nuevo
            </button>
          )}
        </header>

        {/* 🔥 INDICADOR DE PERMISOS EN DESARROLLO */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Debug Permisos:</strong> 
              Módulo: {MODULE_NAMES.INVENTORY} | 
              Crear: {canCreate ? '✅' : '❌'} | 
              Editar: {canEdit ? '✅' : '❌'} | 
              Eliminar: {canDelete ? '✅' : '❌'} |
              Admin: {isAdmin ? '✅' : '❌'}
            </p>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:w-1/3">
            <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar nombre, RUC o contacto"
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); 
              }}
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
              ) : paginatedSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-4 text-center text-gray-500">
                    {searchTerm ? 'No se encontraron resultados' : 'Sin proveedores'}
                  </td>
                </tr>
              ) : (
                paginatedSuppliers.map((s) => (
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
                          s.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {s.status ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-2 flex justify-center gap-2">
                      {/* 🔥 BOTÓN DE EDITAR - SOLO SI TIENE PERMISOS DE EDITAR */}
                      {(canEdit || isAdmin) && (
                        <button
                          onClick={() => setSupplierToEdit(s)}
                          className="text-blue-600 hover:text-blue-800"
                          aria-label={`Editar ${s.suplier_name}`}
                        >
                          <FiEdit2 size={18} />
                        </button>
                      )}
                      
                      {/* 🔥 BOTONES DE ACTIVAR/DESACTIVAR - SOLO SI TIENE PERMISOS DE ELIMINAR */}
                      {(canDelete || isAdmin) && (
                        <>
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
                        </>
                      )}
                      
                      {/* 🔥 MENSAJE CUANDO NO HAY PERMISOS */}
                      {!canEdit && !canDelete && !isAdmin && (
                        <span className="text-gray-400 text-sm">Sin permisos</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalItems > itemsPerPage && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronLeft size={20} />
            </button>

            {renderPageNumbers().map((number, index) => (
              <button
                key={index}
                onClick={() => typeof number === 'number' && handlePageChange(number)}
                className={`w-10 h-10 rounded-full text-sm font-semibold transition-colors duration-200
                  ${
                    number === currentPage
                      ? 'bg-red-600 text-white shadow-md'
                      : typeof number === 'number'
                      ? 'text-gray-700 bg-gray-200 hover:bg-gray-300'
                      : 'text-gray-500 cursor-default'
                  }`}
                disabled={typeof number !== 'number'}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* 🔥 MODAL DE CREAR - SOLO SI TIENE PERMISOS */}
      {isCreateModalOpen && (canCreate || isAdmin) && (
        <ModalCreateSupplier
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateSupplier}
          error={formError}
        />
      )}

      {/* 🔥 MODAL DE EDITAR - SOLO SI TIENE PERMISOS */}
      {supplierToEdit && (canEdit || isAdmin) && (
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