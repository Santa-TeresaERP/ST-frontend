/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  ListChecks,
  Target,
  ShieldAlert,
  Loader2
} from 'lucide-react';

import ModalAddEntrada from './modal-create-ingreso-gasto';
import ModalEditEntrada from './modal-edit-ingreso-gasto';
import ModalDeleteIngresoGasto from './modal-delete-ingreso-gasto';

import {
  useFetchGeneralIncomes,
  useCreateGeneralIncome,
  useUpdateGeneralIncome,
  useDeleteGeneralIncome
} from '../../hooks/useGeneralIncomes';

import {
  useFetchGeneralExpenses,
  useCreateGeneralExpense,
  useUpdateGeneralExpense,
  useDeleteGeneralExpense
} from '../../hooks/useGeneralExpenses';

import {
  GeneralExpense,
  CreateExpensePayload,
} from '../../types/generalExpense';

import {
  GeneralIncome,
  CreateIncomePayload,
} from '../../types/generalIncome';

import { useFetchModules } from '../../../modules/hook/useModules'; // Ajusta ruta
import { useModulePermissions } from '@/core/utils/permission-hooks';
import { MODULE_NAMES } from '@/core/utils/useModulesMap';

interface DetalleReporteProps {
  reporte: {
    id: string;
    name: string;
    fechaInicio: string;
    fechaFin?: string;
    observaciones?: string;
  };
}

type EditEntry = {
  id: string;
  module_id: string;
  income_type?: string;    // solo para ingreso
  expense_type?: string;   // solo para gasto
  amount: number;
  date: string;
  description?: string;
}

// Función para formatear fecha a dd/mm/yyyy
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function DetalleReporte({ reporte }: DetalleReporteProps) {
  // 🔥 HOOKS DE PERMISOS
  const {
    canView: canRead,
    canCreate,
    canEdit,
    canDelete,
    isLoading: permissionsLoading,
    isAdmin
  } = useModulePermissions(MODULE_NAMES.FINANZAS);

  const [tab, setTab] = useState<'ingresos' | 'gastos'>('ingresos');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState<EditEntry | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<GeneralIncome | GeneralExpense | null>(null);

  const { data: modules = [] } = useFetchModules();

  // Hooks para ingresos
  const { data: ingresos = [], isLoading: loadingIngresos } = useFetchGeneralIncomes();
  const createIngreso = useCreateGeneralIncome();
  const updateIngreso = useUpdateGeneralIncome();
  const deleteIngreso = useDeleteGeneralIncome();

  // Hooks para gastos
  const { data: gastos = [], isLoading: loadingGastos } = useFetchGeneralExpenses();
  const createGasto = useCreateGeneralExpense();
  const updateGasto = useUpdateGeneralExpense();
  const deleteGasto = useDeleteGeneralExpense();

  // Totales y formato
  // <-- corrección: convertir explícitamente a Number para evitar concatenación de strings
  const ingresosTotales = useMemo(
    () => ingresos.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0),
    [ingresos]
  );
  const gastosTotales = useMemo(
    () => gastos.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0),
    [gastos]
  );
  const utilidadNeta = ingresosTotales - gastosTotales;
  const formatoMoneda = (valor: number) =>
    `S/. ${valor.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;

  // 🔥 VERIFICACIONES DE ACCESO ANTES DE RENDERIZAR
  if (permissionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Verificando permisos...</h2>
          <p className="text-gray-600">Cargando acceso al detalle de finanzas</p>
        </div>
      </div>
    );
  }

  if (!canRead && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-md w-full text-center p-8">
          <div className="mb-6">
            <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Acceso Restringido</h2>
            <p className="text-gray-600">No tienes permisos para ver los detalles de finanzas</p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // Guardar nuevo ingreso o gasto
  const handleSave = (
    payload: CreateIncomePayload | CreateExpensePayload
  ) => {
    if (tab === 'ingresos') {
      createIngreso.mutate(payload as CreateIncomePayload);
    } else {
      createGasto.mutate(payload as CreateExpensePayload);
    }
    setIsAddOpen(false);
  };

  // Editar ingreso o gasto
  const handleUpdate = (
    updated: EditEntry,
    tipo: 'ingreso' | 'gasto'
  ) => {
    const { id, module_id, income_type, expense_type, amount, date, description } = updated;
    
    const payload: any = {
      module_id,
      amount: Number(amount),
      date,
      description: description || undefined,
    };

    if (tipo === 'ingreso') {
      payload.income_type = income_type;
      updateIngreso.mutate(
        { id, payload },
        {
          onSuccess: () => {
            setIsEditOpen(false);
            setEntryToEdit(null);
          }
        }
      );
    } else {
      payload.expense_type = expense_type;
      updateGasto.mutate(
        { id, payload },
        {
          onSuccess: () => {
            setIsEditOpen(false);
            setEntryToEdit(null);
          }
        }
      );
    }
  };

  // Eliminar ingreso
  const handleDeleteIngreso = () => {
    if (!entryToDelete) return;
    deleteIngreso.mutate(entryToDelete.id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        setEntryToDelete(null);
      }
    });
  };

  // Eliminar gasto
  const handleDeleteGasto = () => {
    if (!entryToDelete) return;
    deleteGasto.mutate(entryToDelete.id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        setEntryToDelete(null);
      }
    });
  };

  // Datos y acciones según tab activo
  const data = tab === 'ingresos' ? ingresos : gastos;
  const isLoading = tab === 'ingresos' ? loadingIngresos : loadingGastos;
  const onDelete = tab === 'ingresos' ? handleDeleteIngreso : handleDeleteGasto;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gray-600 rounded-xl">
              <ListChecks className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Detalles del Reporte Financiero
            </h1>
          </div>
          <p className="text-gray-600 ml-12">
            Período: {formatDate(reporte.fechaInicio)} {reporte.fechaFin && `- ${formatDate(reporte.fechaFin)}`}
          </p>
        </div>

        {/* Cards resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                <p className="text-2xl font-bold text-green-600">{formatoMoneda(ingresosTotales)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">Gastos Totales</p>
                <p className="text-2xl font-bold text-red-600">{formatoMoneda(gastosTotales)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">Utilidad Neta</p>
                <p
                  className={`text-2xl font-bold ${
                    utilidadNeta >= 0 ? 'text-blue-600' : 'text-red-600'
                  }`}
                >
                  {formatoMoneda(utilidadNeta)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs y contenido */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          {/* Tabs header */}
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between p-6">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setTab('ingresos')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    tab === 'ingresos'
                      ? 'bg-white text-green-600 shadow-md'
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  INGRESOS
                  <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded-full">
                    {ingresos.length}
                  </span>
                </button>
                <button
                  onClick={() => setTab('gastos')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    tab === 'gastos'
                      ? 'bg-white text-red-600 shadow-md'
                      : 'text-gray-600 hover:text-red-600'
                  }`}
                >
                  <TrendingDown className="w-4 h-4" />
                  GASTOS
                  <span className="bg-red-100 text-red-700 px-2 py-1 text-xs rounded-full">
                    {gastos.length}
                  </span>
                </button>
              </div>

              {(canCreate || isAdmin) && (
                <button
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 shadow-lg ${
                    tab === 'ingresos'
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                      : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                  }`}
                  onClick={() => setIsAddOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                  Agregar {tab === 'ingresos' ? 'Ingreso' : 'Gasto'}
                </button>
              )}
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-700 to-gray-700 border-b border-gray-200">
                  <th className="text-center py-4 px-6 font-semibold text-white">Módulo</th>
                  <th className="text-center py-4 px-6 font-semibold text-white">
                    Tipo de {tab === 'ingresos' ? 'Ingreso' : 'Gasto'}
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-white">Monto</th>
                  <th className="text-center py-4 px-6 font-semibold text-white">Fecha</th>
                  <th className="text-center py-4 px-6 font-semibold text-white">Observaciones</th>
                  <th className="text-center py-4 px-6 font-semibold text-white">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      Cargando...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      No hay datos
                    </td>
                  </tr>
                ) : (
                  data.map((entry) => {
                    const amount =
                      tab === 'ingresos'
                        ? Number((entry as GeneralIncome).amount)
                        : Number((entry as GeneralExpense).amount);

                    const moduleName = modules.find((m) => m.id === entry.module_id)?.name || 'Sin módulo';

                    // Formatear fecha aquí
                    const fechaFormateada = formatDate(
                      tab === 'ingresos'
                        ? (entry as GeneralIncome).date
                        : (entry as GeneralExpense).date
                    );

                    return (
                      <tr
                        key={entry.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 bg-white"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="font-medium text-gray-800">{moduleName}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                              tab === 'ingresos' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}
                          >
                            <DollarSign className="w-3 h-3" />
                            {tab === 'ingresos'
                              ? (entry as GeneralIncome).income_type
                              : (entry as GeneralExpense).expense_type}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`font-bold text-lg ${
                              tab === 'ingresos' ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            S/. {isNaN(amount) ? '0.00' : amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{fechaFormateada}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-gray-600 text-sm max-w-xs truncate block">
                            {tab === 'ingresos'
                              ? (entry as GeneralIncome).description ?? ''
                              : (entry as GeneralExpense).description ?? ''}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center gap-2">
                            {(canEdit || isAdmin) && (
                              <button
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                title="Editar"
                                onClick={() => {
                                  setEntryToEdit({
                                    id: entry.id,
                                    module_id: entry.module_id || '',
                                    income_type:
                                      tab === 'ingresos'
                                        ? (entry as GeneralIncome).income_type
                                        : (entry as GeneralExpense).expense_type,
                                    amount:
                                      tab === 'ingresos'
                                        ? (entry as GeneralIncome).amount
                                        : (entry as GeneralExpense).amount,
                                    date:
                                      tab === 'ingresos'
                                        ? (entry as GeneralIncome).date
                                        : (entry as GeneralExpense).date,
                                    description:
                                      tab === 'ingresos'
                                        ? (entry as GeneralIncome).description ?? ''
                                        : (entry as GeneralExpense).description ?? '',
                                  });
                                  setIsEditOpen(true);
                                }}
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            )}
                            {(canDelete || isAdmin) && (
                              <button
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                title="Eliminar"
                                onClick={() => {
                                  setEntryToDelete(entry);
                                  setIsDeleteOpen(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modales */}
      {isAddOpen && (
        <ModalAddEntrada
          tipo={tab === 'ingresos' ? 'ingreso' : 'gasto'}
          onClose={() => setIsAddOpen(false)}
          onSave={handleSave}
        />
      )}

      {isEditOpen && entryToEdit && (
        <ModalEditEntrada
          tipo={tab === 'ingresos' ? 'ingreso' : 'gasto'}
          data={entryToEdit}
          onClose={() => {
            setIsEditOpen(false);
            setEntryToEdit(null);
          }}
          onSave={(data) => handleUpdate(data, tab === 'ingresos' ? 'ingreso' : 'gasto')}
        />
      )}

      {isDeleteOpen && entryToDelete && (
        <ModalDeleteIngresoGasto
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setEntryToDelete(null);
          }}
          onConfirm={onDelete}
          type={tab === 'ingresos' ? 'ingreso' : 'gasto'}
        />
      )}
    </div>
  );
}
