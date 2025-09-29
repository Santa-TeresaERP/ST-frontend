'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { PlusCircle, Edit, Trash2, ShieldAlert, Loader2 } from 'lucide-react';

// Importar hooks y tipos necesarios
import { useMonasteryOverheads } from '@/modules/monastery/hooks/useOverheads';
import { useMonasteryExpenses } from '@/modules/monastery/hooks/useMonasteryExpenses';
import { Overhead } from '@/modules/monastery/types/overheads';
import { MonasteryExpense } from '@/modules/monastery/types/monasteryexpense';
import { useModulePermissions } from '@/core/utils/permission-hooks';
import { MODULE_NAMES } from '@/core/utils/useModulesMap';

// Importar componentes de modales
import ModalCreateOverhead from '@/modules/monastery/components/overhead/modal-create-overhead';
import ModalEditOverhead from '@/modules/monastery/components/overhead/modal-edit-overhead';
import ModalDeleteOverhead from '@/modules/monastery/components/overhead/modal-delete-overhead';
import ModalCreateMonastery from '@/modules/monastery/components/monastery/modal-create-monastery';
import ModalEditMonastery from '@/modules/monastery/components/monastery/modal-edit-monastery';
import ModalDeleteMonastery from '@/modules/monastery/components/monastery/modal-delete-monastery';

type Tab = 'overheads' | 'expenses';

const MonasteryComponentView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overheads');

  // Sistema de permisos optimizado
  const { canCreate, canEdit, canDelete, canView, isLoading: permissionsLoading, isAdmin } = useModulePermissions(MODULE_NAMES.MONASTERIO);

  // Hooks para cargar datos
  const { data: overheadsData, loading: overheadsLoading, error: overheadsError } = useMonasteryOverheads();
  const { data: expensesData, loading: expensesLoading, error: expensesError } = useMonasteryExpenses();

  // Estados de modales
  const [modalOverheadCreate, setModalOverheadCreate] = useState(false);
  const [modalOverheadEdit, setModalOverheadEdit] = useState<Overhead | null>(null);
  const [modalOverheadDelete, setModalOverheadDelete] = useState<Overhead | null>(null);
  const [modalExpenseCreate, setModalExpenseCreate] = useState(false);
  const [modalExpenseEdit, setModalExpenseEdit] = useState<MonasteryExpense | null>(null);
  const [modalExpenseDelete, setModalExpenseDelete] = useState<MonasteryExpense | null>(null);

  // Debugging para ver qué está pasando
  console.log('=== MONASTERY COMPONENT DEBUG ===');
  console.log('Overheads Data:', overheadsData);
  console.log('Overheads Loading:', overheadsLoading);  
  console.log('Overheads Error:', overheadsError);
  console.log('Expenses Data:', expensesData);
  console.log('Expenses Loading:', expensesLoading);
  console.log('Expenses Error:', expensesError);

  // DEBUGGING DETALLADO DE ESTRUCTURA DE DATOS
  console.log('🔍 DEBUGGING RAW DATA:');
  console.log('  - overheadsData RAW:', JSON.stringify(overheadsData, null, 2));
  console.log('  - expensesData RAW:', JSON.stringify(expensesData, null, 2));
  console.log('  - overheadsData es array?:', Array.isArray(overheadsData));
  console.log('  - expensesData es array?:', Array.isArray(expensesData));

  if (overheadsData && overheadsData.length > 0) {
    console.log('🔍 PRIMER OVERHEAD DETALLE:');
    console.log('  - Objeto completo:', overheadsData[0]);
    console.log('  - Keys disponibles:', Object.keys(overheadsData[0]));
    console.log('  - name:', overheadsData[0].name);
    console.log('  - amount:', overheadsData[0].amount, 'tipo:', typeof overheadsData[0].amount);
    console.log('  - date:', overheadsData[0].date, 'tipo:', typeof overheadsData[0].date);
    console.log('  - status:', overheadsData[0].status, 'tipo:', typeof overheadsData[0].status);
  }

  if (expensesData && expensesData.length > 0) {
    console.log('🔍 PRIMER EXPENSE DETALLE:');
    console.log('  - Objeto completo:', expensesData[0]);
    console.log('  - Keys disponibles:', Object.keys(expensesData[0]));
    console.log('  - id:', expensesData[0].id);
    console.log('  - category:', expensesData[0].category);
    console.log('  - Name:', expensesData[0].Name);
    console.log('  - amount:', expensesData[0].amount, 'tipo:', typeof expensesData[0].amount);
    console.log('  - date:', expensesData[0].date, 'tipo:', typeof expensesData[0].date);
    console.log('  - descripción:', expensesData[0].descripción);
    console.log('  - overheadsId:', expensesData[0].overheadsId);
  }

  // Mostrar loading mientras se verifican permisos
  if (permissionsLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Verificar permisos de acceso al módulo
  if (!canView && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
          <ShieldAlert className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600 mb-4">
            No tienes permisos para ver el módulo del monasterio.
          </p>
          <p className="text-sm text-gray-500">
            Contacta al administrador para obtener acceso.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-center text-purple-700 pb-4">🏛️ Gestión del Monasterio</h1>
        <p className="text-gray-600 text-center">Administra gastos generales y gastos específicos del monasterio</p>
      </div>

      {/* Indicador de permisos en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-sm text-purple-800">
            <strong>Debug Permisos:</strong> 
            Módulo: {MODULE_NAMES.MONASTERIO} | 
            Ver: {canView ? '✅' : '❌'} | 
            Crear: {canCreate ? '✅' : '❌'} | 
            Editar: {canEdit ? '✅' : '❌'} | 
            Eliminar: {canDelete ? '✅' : '❌'} | 
            Admin: {isAdmin ? '✅' : '❌'} |
            Loading: {permissionsLoading ? '⏳' : '✅'}
          </p>
        </div>
      )}

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-9">
        <button
          onClick={() => setActiveTab('overheads')}
          className={`p-6 rounded-xl shadow-sm transition-all duration-300 transform hover:scale-105 ${
            activeTab === 'overheads'
              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
              : 'bg-white border border-gray-200 hover:border-purple-300'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${
              activeTab === 'overheads' ? 'bg-purple-400' : 'bg-purple-100 text-purple-600'
            }`}>
              <Image 
                src="/finanzas.png" 
                alt="Gastos Generales" 
                width={24} 
                height={24}
                className="h-6 w-6"
              />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Gastos Generales</h3>
              <p className="text-sm opacity-80">
                {overheadsData ? `${overheadsData.length} registros` : 'Cargando...'}
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`p-6 rounded-xl shadow-sm transition-all duration-300 transform hover:scale-105 ${
            activeTab === 'expenses'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
              : 'bg-white border border-gray-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${
              activeTab === 'expenses' ? 'bg-amber-400' : 'bg-amber-100 text-amber-600'
            }`}>
              <Image 
                src="/monastery.png" 
                alt="Gastos del Monasterio" 
                width={24} 
                height={24}
                className="h-6 w-6"
              />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Gastos del Monasterio</h3>
              <p className="text-sm opacity-80">
                {expensesData ? `${expensesData.length} registros` : 'Cargando...'}
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {activeTab === 'overheads' && (
          <OverheadsView 
            data={overheadsData}
            loading={overheadsLoading}
            error={overheadsError}
            canCreate={canCreate}
            canEdit={canEdit}
            canDelete={canDelete}
            onCreateClick={() => setModalOverheadCreate(true)}
            onEditClick={setModalOverheadEdit}
            onDeleteClick={setModalOverheadDelete}
          />
        )}
        
        {activeTab === 'expenses' && (
          <ExpensesView 
            data={expensesData}
            loading={expensesLoading}
            error={expensesError}
            canCreate={canCreate}
            canEdit={canEdit}
            canDelete={canDelete}
            onCreateClick={() => setModalExpenseCreate(true)}
            onEditClick={setModalExpenseEdit}
            onDeleteClick={setModalExpenseDelete}
          />
        )}
      </div>

      {/* Modales para Gastos Generales */}
      <ModalCreateOverhead 
        isOpen={modalOverheadCreate} 
        onClose={() => setModalOverheadCreate(false)} 
      />
      <ModalEditOverhead 
        isOpen={!!modalOverheadEdit} 
        onClose={() => setModalOverheadEdit(null)} 
        overheadToEdit={modalOverheadEdit} 
      />
      {modalOverheadDelete && (
        <ModalDeleteOverhead 
          isOpen={!!modalOverheadDelete} 
          onClose={() => setModalOverheadDelete(null)} 
          onConfirm={() => {
            // TODO: Implementar la lógica de eliminación
            console.log('Eliminar overhead:', modalOverheadDelete);
            setModalOverheadDelete(null);
          }}
          isPending={false}
          overheadName={modalOverheadDelete.name}
        />
      )}

      {/* Modales para Gastos del Monasterio */}
      <ModalCreateMonastery 
        isOpen={modalExpenseCreate} 
        onClose={() => setModalExpenseCreate(false)} 
      />
      <ModalEditMonastery 
        isOpen={!!modalExpenseEdit} 
        onClose={() => setModalExpenseEdit(null)} 
        expenseToEdit={modalExpenseEdit} 
      />
      {modalExpenseDelete && (
        <ModalDeleteMonastery 
          isOpen={!!modalExpenseDelete} 
          onClose={() => setModalExpenseDelete(null)} 
          onConfirm={() => {
            // TODO: Implementar la lógica de eliminación
            console.log('Eliminar expense:', modalExpenseDelete);
            setModalExpenseDelete(null);
          }}
          isPending={false}
          monasteryExpenseName={modalExpenseDelete.descripción || 'Gasto sin descripción'}
        />
      )}
    </div>
  );
};

// Funciones helper para manejar datos de forma segura
const safeAmount = (amount: unknown): string => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '0.00';
  }
  return Number(amount).toFixed(2);
};

const safeDate = (date: unknown): string => {
  if (!date) return 'Sin fecha';
  
  try {
    const dateObj = new Date(String(date));
    if (isNaN(dateObj.getTime())) {
      return 'Fecha inválida';
    }
    return dateObj.toLocaleDateString('es-ES');
  } catch {
    return 'Error en fecha';
  }
};

const safeName = (name: unknown, fallback: string = 'Sin nombre'): string => {
  if (!name || name === null || name === undefined || name === '') {
    return fallback;
  }
  return String(name);
};

// Componente para mostrar la vista de Gastos Generales
interface OverheadsViewProps {
  data: Overhead[] | null;
  loading: boolean;
  error: string | null;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onCreateClick: () => void;
  onEditClick: (overhead: Overhead) => void;
  onDeleteClick: (overhead: Overhead) => void;
}

const OverheadsView: React.FC<OverheadsViewProps> = ({
  data,
  loading,
  error,
  canCreate,
  canEdit,
  canDelete,
  onCreateClick,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📊 Gastos Generales</h2>
        {canCreate && (
          <button
            onClick={onCreateClick}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Nuevo Gasto General</span>
          </button>
        )}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-purple-600" />
          <span className="ml-2 text-gray-600">Cargando gastos generales...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      {!loading && !error && data && data.length === 0 && (
        <div className="text-center py-12">
          <Image 
            src="/finanzas.png" 
            alt="Sin datos" 
            width={64} 
            height={64}
            className="h-16 w-16 mx-auto mb-4 opacity-50"
          />
          <p className="text-gray-500">No hay gastos generales registrados</p>
          {canCreate && (
            <button
              onClick={onCreateClick}
              className="mt-4 text-purple-600 hover:text-purple-800 underline"
            >
              Crear el primer gasto general
            </button>
          )}
        </div>
      )}

      {!loading && !error && data && data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((overhead: Overhead, index) => (
                <tr key={`overhead-${overhead.id}-${index}`} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{safeName(overhead.name)}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      overhead.type === 'monasterio' ? 'bg-purple-100 text-purple-800' :
                      overhead.type === 'donativo' ? 'bg-green-100 text-green-800' :
                      overhead.type === 'gasto mensual' ? 'bg-blue-100 text-blue-800' :
                      overhead.type === 'otro ingreso' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {overhead.type || 'Sin tipo'}
                    </span>
                  </td>
                  <td className="px-4 py-2">{safeName(overhead.description, '-')}</td>
                  <td className="px-4 py-2">S/ {safeAmount(overhead.amount)}</td>
                  <td className="px-4 py-2">{safeDate(overhead.date)}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      overhead.status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {overhead.status ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      {canEdit && (
                        <button
                          onClick={() => onEditClick(overhead)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => onDeleteClick(overhead)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Componente para mostrar la vista de Gastos del Monasterio
interface ExpensesViewProps {
  data: MonasteryExpense[] | null;
  loading: boolean;
  error: string | null;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onCreateClick: () => void;
  onEditClick: (expense: MonasteryExpense) => void;
  onDeleteClick: (expense: MonasteryExpense) => void;
}

const ExpensesView: React.FC<ExpensesViewProps> = ({
  data,
  loading,
  error,
  canCreate,
  canEdit,
  canDelete,
  onCreateClick,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🏛️ Gastos del Monasterio</h2>
        {canCreate && (
          <button
            onClick={onCreateClick}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Nuevo Gasto del Monasterio</span>
          </button>
        )}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-amber-600" />
          <span className="ml-2 text-gray-600">Cargando gastos del monasterio...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      {!loading && !error && data && data.length === 0 && (
        <div className="text-center py-12">
          <Image 
            src="/monastery.png" 
            alt="Sin datos" 
            width={64} 
            height={64}
            className="h-16 w-16 mx-auto mb-4 opacity-50"
          />
          <p className="text-gray-500">No hay gastos del monasterio registrados</p>
          {canCreate && (
            <button
              onClick={onCreateClick}
              className="mt-4 text-amber-600 hover:text-amber-800 underline"
            >
              Crear el primer gasto del monasterio
            </button>
          )}
        </div>
      )}

      {!loading && !error && data && data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gasto General</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((expense: MonasteryExpense, index) => (
                <tr key={`expense-${expense.id}-${index}`} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{safeName(expense.Name || expense.overheadsId)}</td>
                  <td className="px-4 py-2">{safeName(expense.descripción, '-')}</td>
                  <td className="px-4 py-2">S/ {safeAmount(expense.amount)}</td>
                  <td className="px-4 py-2">{safeDate(expense.date)}</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Activo
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      {canEdit && (
                        <button
                          onClick={() => onEditClick(expense)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => onDeleteClick(expense)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MonasteryComponentView;