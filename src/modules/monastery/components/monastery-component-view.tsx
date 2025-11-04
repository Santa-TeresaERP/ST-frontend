'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { PlusCircle, Edit, Trash2, Filter, Calendar, Search, DollarSign, ShieldAlert } from 'lucide-react';

// 1. IMPORTAR HOOKS Y TIPOS NECESARIOS
import { useFetchMonasterioOverheads, useDeleteOverhead } from '@/modules/monastery/hooks/useOverheads';
import { Overhead } from '@/modules/monastery/types/overheads';

// NUEVO: Importar hooks y tipos de monastery expenses
import { 
  useMonasteryExpenses,
  useDeleteMonasteryExpense 
} from '@/modules/monastery/hooks/useMonasteryExpense';
import { MonasteryExpenses } from '@/modules/monastery/types/monasteryExpenses';

// 🔥 IMPORTAR SISTEMA DE PERMISOS Y HOOK DE USUARIO ACTUAL
import { 
  AccessDeniedModal,
} from '@/core/utils';
import { useModulePermission, MODULE_NAMES } from '@/core/utils/useModulesMap';
import { useCurrentUser } from '@/modules/auth/hook/useCurrentUser';
import { useAuthStore } from '@/core/store/auth';
import { suppressAxios403Errors } from '@/core/utils/error-suppressor';
import { useQueryClient } from '@tanstack/react-query';

// Importar los modales de monasterio (OVERHEAD = Gastos Generales)
import ModalCreateMonasteryExpense from './overhead/modal-create-monastery-expense';
import ModalEditMonasteryExpense from './overhead/modal-edit-monastery-expense';
import ModalDeleteMonasteryExpense from './overhead/modal-delete-monastery-expense';

// NUEVO: Importar los modales de monastery expenses (GASTOS DEL MONASTERIO)
import ModalCreateExpense from './monastery-expenses/modal-create-monastery-expense';
import ModalEditExpense from './monastery-expenses/modal-edit-monastery-expense';
import ModalDeleteExpense from './monastery-expenses/modal-delete-monastery-expense';

// 🔥 INTERFAZ PARA ERRORES DE AXIOS
interface AxiosError extends Error {
  response?: {
    status: number;
    data?: unknown;
  };
}

const MonasteryComponentView: React.FC = () => {
  // 🔥 SISTEMA DE PERMISOS COMPLETO
  const queryClient = useQueryClient();
  
  // 🔥 OBTENER USUARIO ACTUAL CON SUS PERMISOS DESDE /auth/me
  const { user } = useAuthStore();
  const { data: currentUserWithPermissions, isLoading: usersLoading } = useCurrentUser();
  
  // 🔥 VERIFICAR PERMISOS USANDO EL SISTEMA DINÁMICO
  const { 
    hasPermission: canView, 
    isLoading: permissionsLoading 
  } = useModulePermission(MODULE_NAMES.MONASTERIO, 'canRead');
  
  const { hasPermission: canEdit } = useModulePermission(MODULE_NAMES.MONASTERIO, 'canEdit');
  const { hasPermission: canCreate } = useModulePermission(MODULE_NAMES.MONASTERIO, 'canWrite');
  const { hasPermission: canDelete } = useModulePermission(MODULE_NAMES.MONASTERIO, 'canDelete');
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = (currentUserWithPermissions as any)?.Role?.name === 'Admin';
  
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [accessDeniedAction, setAccessDeniedAction] = useState('');

  // 🔥 ACTIVAR SUPRESOR DE ERRORES 403 EN LA CONSOLA
  useEffect(() => {
    suppressAxios403Errors();
  }, []);

  // 🔥 DEBUG: Ver permisos actuales
  console.log('🔍 MonasteryComponent - Análisis de Permisos:', {
    userId: user?.id,
    userFound: !!currentUserWithPermissions,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    roleName: (currentUserWithPermissions as any)?.Role?.name,
    moduleName: MODULE_NAMES.MONASTERIO,
    permisos: { canView, canEdit, canCreate, canDelete, isAdmin },
    usersLoading,
    permissionsLoading
  });

  // 🔥 FUNCIÓN PARA MANEJAR ACCESO DENEGADO
  const handleAccessDenied = (action: string) => {
    setAccessDeniedAction(action);
    setShowAccessDenied(true);
  };

  // 1. Estado para controlar qué vista mostrar (DEBE IR ANTES DE LOS HOOKS DE DATOS)
  const [activeView, setActiveView] = useState<'overheads' | 'expenses'>('expenses');

  // 2. OBTENER DATOS Y MUTACIONES - OVERHEADS (gastos generales) - Solo cuando está en vista de overheads
  const { 
    data: overheadData, 
    isLoading: overheadLoading, 
    error: overheadError,
    refetch: refetchOverheads  // ✅ Agregar refetch manual
  } = useFetchMonasterioOverheads();
  const deleteOverheadMutation = useDeleteOverhead();

  // 3. OBTENER DATOS Y MUTACIONES - MONASTERY EXPENSES (gastos específicos del monasterio) - Solo cuando está en vista de expenses
  const { 
    data: expenseData, 
    isLoading: expenseLoading, 
    error: expenseError 
  } = useMonasteryExpenses({
    enabled: activeView === 'expenses' // ✅ SOLO cargar cuando esté en vista de expenses
  });

  // NUEVO: Hook para eliminar monastery expenses
  const deleteMonasteryExpenseMutation = useDeleteMonasteryExpense();

  // 4. ESTADO LOCAL PARA LA UI - OVERHEADS
  const [isCreateOverheadModalOpen, setCreateOverheadModalOpen] = useState(false);
  const [isEditOverheadModalOpen, setEditOverheadModalOpen] = useState(false);
  const [isDeleteOverheadModalOpen, setDeleteOverheadModalOpen] = useState(false);
  const [selectedOverhead, setSelectedOverhead] = useState<Overhead | null>(null);
  
  // 5. ESTADO LOCAL PARA LA UI - MONASTERY EXPENSES
  const [selectedExpense, setSelectedExpense] = useState<MonasteryExpenses | null>(null);
  const [isCreateExpenseModalOpen, setCreateExpenseModalOpen] = useState(false);
  const [isEditExpenseModalOpen, setEditExpenseModalOpen] = useState(false);
  const [isDeleteExpenseModalOpen, setDeleteExpenseModalOpen] = useState(false);
  
  // 6. Estados para filtros de Overheads (movido después de activeView)
  const [overheadFilters, setOverheadFilters] = useState({
    searchTerm: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
    sortBy: 'date' as 'date' | 'name' | 'amount'
  });

  // 8. Estados para filtros de Gastos de Monasterio
  const [expenseFilters, setExpenseFilters] = useState({
    searchTerm: '',
    category: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
    sortBy: 'date' as 'date' | 'name' | 'amount'
  });

  // 9. DATOS PROCESADOS - OVERHEADS (✅ SOLO cuando está en vista de overheads)
  const overheadRows = useMemo(() => {
    // ✅ SI NO está en vista de overheads, devolver array vacío
    if (activeView !== 'overheads') return [];
    // ✅ SI NO hay datos de overheads, devolver array vacío
    if (!overheadData) return [];
    // ✅ Procesar solo cuando esté en la vista correcta Y tenga datos
    const processedData = Array.isArray(overheadData) ? overheadData : [];
    
    // 🔍 FILTRAR SOLO LOS OVERHEADS ACTIVOS (status: true)
    const activeOverheads = processedData.filter(overhead => overhead.status === true);
    
    console.log('🔍 Total overheads desde API:', processedData.length);
    console.log('✅ Overheads activos (filtrados):', activeOverheads.length);
    
    return activeOverheads;
  }, [overheadData, activeView]);

  // 10. DATOS PROCESADOS - MONASTERY EXPENSES (✅ SOLO cuando está en vista de expenses)
  const expenseRows = useMemo(() => {
    // ✅ SI NO está en vista de expenses, devolver array vacío
    if (activeView !== 'expenses') return [];
    // ✅ SI NO hay datos de expenses, devolver array vacío
    if (!expenseData) return [];
    
    // ✅ Procesar solo cuando esté en la vista correcta Y tenga datos
    // Los datos de expenses vienen en formato {success: true, data: Array}
    if (expenseData && typeof expenseData === 'object' && 'data' in expenseData) {
      return Array.isArray(expenseData.data) ? expenseData.data : [];
    }
    return Array.isArray(expenseData) ? expenseData : [];
  }, [expenseData, activeView]);

  // 11. FILTRAR DATOS - OVERHEADS (✅ SOLO procesar cuando hay datos de overheads)
  const filteredOverheadData = useMemo(() => {
    // ✅ Si no está en vista de overheads O no hay datos, devolver array vacío
    if (activeView !== 'overheads' || !overheadRows.length) return [];
    
    let filtered = overheadRows;

    // Filtro por término de búsqueda
    if (overheadFilters.searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(overheadFilters.searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(overheadFilters.searchTerm.toLowerCase()))
      );
    }

    // Filtro por rango de fechas
    if (overheadFilters.dateFrom) {
      filtered = filtered.filter(item => new Date(item.date) >= new Date(overheadFilters.dateFrom));
    }
    if (overheadFilters.dateTo) {
      filtered = filtered.filter(item => new Date(item.date) <= new Date(overheadFilters.dateTo));
    }

    // Filtro por rango de montos
    if (overheadFilters.minAmount) {
      filtered = filtered.filter(item => Number(item.amount) >= Number(overheadFilters.minAmount));
    }
    if (overheadFilters.maxAmount) {
      filtered = filtered.filter(item => Number(item.amount) <= Number(overheadFilters.maxAmount));
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (overheadFilters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'amount':
          return Number(b.amount) - Number(a.amount);
        case 'date':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return filtered;
  }, [overheadRows, overheadFilters, activeView]);

  // 12. FILTRAR DATOS - MONASTERY EXPENSES (✅ SOLO procesar cuando hay datos de expenses)
  const filteredExpenseData = useMemo(() => {
    // ✅ Si no está en vista de expenses O no hay datos, devolver array vacío
    if (activeView !== 'expenses' || !expenseRows.length) return [];
    
    let filtered = expenseRows;

    // Filtro por término de búsqueda
    if (expenseFilters.searchTerm) {
      filtered = filtered.filter(item =>
        item.Name.toLowerCase().includes(expenseFilters.searchTerm.toLowerCase()) ||
        item.descripción.toLowerCase().includes(expenseFilters.searchTerm.toLowerCase())
      );
    }

    // Filtro por categoría
    if (expenseFilters.category) {
      filtered = filtered.filter(item => item.category === expenseFilters.category);
    }

    // Filtro por rango de fechas
    if (expenseFilters.dateFrom) {
      filtered = filtered.filter(item => new Date(item.date) >= new Date(expenseFilters.dateFrom));
    }
    if (expenseFilters.dateTo) {
      filtered = filtered.filter(item => new Date(item.date) <= new Date(expenseFilters.dateTo));
    }

    // Filtro por rango de montos
    if (expenseFilters.minAmount) {
      filtered = filtered.filter(item => Number(item.amount) >= Number(expenseFilters.minAmount));
    }
    if (expenseFilters.maxAmount) {
      filtered = filtered.filter(item => Number(item.amount) <= Number(expenseFilters.maxAmount));
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (expenseFilters.sortBy) {
        case 'name':
          return a.Name.localeCompare(b.Name);
        case 'amount':
          return Number(b.amount) - Number(a.amount);
        case 'date':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return filtered;
  }, [expenseRows, expenseFilters, activeView]);

  // 13. ESTADÍSTICAS - OVERHEADS
  const overheadStats = useMemo(() => {
    const totalAmount = filteredOverheadData.reduce((sum, item) => sum + Number(item.amount), 0);
    const avgAmount = filteredOverheadData.length > 0 ? totalAmount / filteredOverheadData.length : 0;

    return {
      total: filteredOverheadData.length,
      totalAmount: totalAmount,
      avgAmount: avgAmount
    };
  }, [filteredOverheadData]);

  // 14. ESTADÍSTICAS - MONASTERY EXPENSES
  const expenseStats = useMemo(() => {
    const totalAmount = filteredExpenseData.reduce((sum, item) => sum + Number(item.amount), 0);
    const avgAmount = filteredExpenseData.length > 0 ? totalAmount / filteredExpenseData.length : 0;

    return {
      total: filteredExpenseData.length,
      totalAmount: totalAmount,
      avgAmount: avgAmount
    };
  }, [filteredExpenseData]);

  // 15. LOGS DE DEPURACIÓN (✅ SOLO para la vista activa Y cuando hay datos)
  useEffect(() => {
    if (activeView === 'overheads' && overheadData) {
      console.log('✅ [Monastery] OVERHEADS data RAW (desde API):', overheadData.length, 'registros');
      console.log('✅ [Monastery] OVERHEADS data ACTIVOS (filtrados):', overheadRows.length, 'registros');
      
      // 🔍 Mostrar estado de cada overhead para debug
      overheadData.forEach((overhead, index) => {
        const statusIcon = overhead.status ? '✅' : '❌';
        console.log(`${statusIcon} Overhead ${index + 1}: ${overhead.name} (status: ${overhead.status})`);
      });
    }
    if (activeView === 'expenses' && expenseData) {
      console.log('✅ [Monastery] EXPENSES data (solo en vista activa):', expenseData);
    }
  }, [overheadData, expenseData, activeView, overheadRows]);

  useEffect(() => {
    if (overheadError) {
      console.error('[Monastery] overhead error:', overheadError);
    }
    if (expenseError) {
      console.error('[Monastery] expense error:', expenseError);
    }
  }, [overheadError, expenseError]);

  // 🔥 VERIFICAR ERRORES 403 Y PERMISOS DESPUÉS DE TODOS LOS HOOKS
  const is403ErrorOverheads = overheadError && (overheadError.message.includes('403') || overheadError.message.includes('Forbidden'));
  const is403ErrorExpenses = expenseError && (expenseError.message.includes('403') || expenseError.message.includes('Forbidden'));

  // 🔥 EARLY RETURNS PARA ESTADOS DE CARGA Y ERRORES
  if (usersLoading || permissionsLoading) {
    return <div className="text-center text-red-800 font-semibold">Cargando módulo y permisos...</div>;
  }

  // 🔥 VERIFICAR ERROR 403 INMEDIATAMENTE - NO ESPERAR A PERMISOS
  if (is403ErrorOverheads || is403ErrorExpenses) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
          <ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600 mb-4">
            No tienes permisos para ver la gestión del monasterio.
          </p>
          <p className="text-sm text-gray-500">
            Contacta al administrador para obtener acceso.
          </p>
        </div>
      </div>
    );
  }

  // 🔥 VERIFICAR SI TIENE PERMISO PARA VER EL MÓDULO (verificación adicional por permisos locales)
  if (!canView && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
          <ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600 mb-4">
            No tienes permisos para ver la gestión del monasterio.
          </p>
          <p className="text-sm text-gray-500">
            Contacta al administrador para obtener acceso.
          </p>
        </div>
      </div>
    );
  }

  // 16. MANEJADORES DE EVENTOS PARA OVERHEADS
  const handleOpenEditOverheadModal = (overhead: Overhead) => {
    if (!canEdit && !isAdmin) {
      handleAccessDenied('editar este gasto general');
      return;
    }
    setSelectedOverhead(overhead);
    setEditOverheadModalOpen(true);
  };

  const handleOpenDeleteOverheadModal = (overhead: Overhead) => {
    if (!canDelete && !isAdmin) {
      handleAccessDenied('eliminar este gasto general');
      return;
    }
    setSelectedOverhead(overhead);
    setDeleteOverheadModalOpen(true);
  };
  
  const handleDeleteOverheadConfirm = async () => {
    if (!selectedOverhead) return;
    if (!canDelete && !isAdmin) {
      handleAccessDenied('eliminar este gasto general (permisos revocados)');
      return;
    }
    
    try {
      console.log('🔥 Eliminando overhead ID:', selectedOverhead.id, 'Nombre:', selectedOverhead.name);
      
      await deleteOverheadMutation.mutateAsync(selectedOverhead.id);
      
      console.log('✅ Overhead eliminado exitosamente (borrado lógico) - ID:', selectedOverhead.id);
      console.log('🔄 Los datos se actualizarán automáticamente...');
      
      setDeleteOverheadModalOpen(false);
      setSelectedOverhead(null);
      
      // ✅ El refetch manual ya no debería ser necesario con el filtro de status
      setTimeout(() => {
        console.log('🔄 Refetch manual como backup...');
        refetchOverheads();
      }, 500);
      
    } catch (error) {
      // 🔥 VERIFICAR SI ES ERROR 403 SIN MOSTRARLO EN CONSOLA
      const isPermissionError = (error as AxiosError)?.response?.status === 403 ||
                               error instanceof Error && (
                                 error.message.includes('403') || 
                                 error.message.includes('Forbidden')
                               );

      if (isPermissionError) {
        setDeleteOverheadModalOpen(false);
        setSelectedOverhead(null);
        handleAccessDenied('eliminar este gasto general (permisos revocados)');
        queryClient.invalidateQueries({ queryKey: ['users'] });
        return; // 🔥 SALIR SILENCIOSAMENTE
      }
      
      console.error('❌ Error al eliminar overhead:', error);
      alert('Error al eliminar el gasto general. Por favor, inténtalo de nuevo.');
    }
  };

  // 17. MANEJADORES DE EVENTOS PARA MONASTERY EXPENSES
  const handleOpenCreateExpenseModal = () => {
    if (!canCreate && !isAdmin) {
      handleAccessDenied('crear gastos del monasterio');
      return;
    }
    setCreateExpenseModalOpen(true);
  };

  const handleOpenEditExpenseModal = (expense: MonasteryExpenses) => {
    if (!canEdit && !isAdmin) {
      handleAccessDenied('editar este gasto del monasterio');
      return;
    }
    setSelectedExpense(expense);
    setEditExpenseModalOpen(true);
  };

  // Función para abrir modal de confirmación de eliminación
  const handleOpenDeleteExpenseModal = (expense: MonasteryExpenses) => {
    if (!canDelete && !isAdmin) {
      handleAccessDenied('eliminar este gasto del monasterio');
      return;
    }
    setSelectedExpense(expense);
    setDeleteExpenseModalOpen(true);
  };

  // Función para confirmar eliminación de monastery expense
  const handleDeleteExpenseConfirm = async () => {
    if (!selectedExpense) return;
    if (!canDelete && !isAdmin) {
      handleAccessDenied('eliminar este gasto del monasterio (permisos revocados)');
      return;
    }
    
    try {
      console.log('🔥 Eliminando monastery expense ID:', selectedExpense.id, 'Descripción:', selectedExpense.descripción);
      
      await deleteMonasteryExpenseMutation.mutateAsync(selectedExpense.id);
      
      console.log('✅ Monastery expense eliminado exitosamente:', selectedExpense.descripción);
      
      setDeleteExpenseModalOpen(false);
      setSelectedExpense(null);
      
    } catch (error) {
      // 🔥 VERIFICAR SI ES ERROR 403 SIN MOSTRARLO EN CONSOLA
      const isPermissionError = (error as AxiosError)?.response?.status === 403 ||
                               error instanceof Error && (
                                 error.message.includes('403') || 
                                 error.message.includes('Forbidden')
                               );

      if (isPermissionError) {
        setDeleteExpenseModalOpen(false);
        setSelectedExpense(null);
        handleAccessDenied('eliminar este gasto del monasterio (permisos revocados)');
        queryClient.invalidateQueries({ queryKey: ['users'] });
        return; // 🔥 SALIR SILENCIOSAMENTE
      }
      
      console.error('❌ Error al eliminar monastery expense:', error);
      alert('Error al eliminar el gasto del monasterio. Por favor, inténtalo de nuevo.');
    }
  };

  // 18. COMPONENTE DE FILTROS PARA OVERHEADS
  const renderOverheadFilters = () => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
      <div className="flex items-center mb-4">
        <Filter className="text-red-600 mr-2" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">Filtros y Estadísticas</h3>
      </div>
      
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-red-600 font-medium">Total Gastos</p>
          <p className="text-2xl font-bold text-red-700">{overheadStats.total}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Monto Total S/.</p>
          <p className="text-2xl font-bold text-blue-700">{overheadStats.totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-600 font-medium">Promedio S/.</p>
          <p className="text-2xl font-bold text-green-700">{overheadStats.avgAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar gastos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={overheadFilters.searchTerm}
            onChange={(e) => setOverheadFilters({...overheadFilters, searchTerm: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              value={overheadFilters.dateFrom}
              onChange={(e) => setOverheadFilters({...overheadFilters, dateFrom: e.target.value})}
              title="Fecha desde"
            />
          </div>
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            value={overheadFilters.dateTo}
            onChange={(e) => setOverheadFilters({...overheadFilters, dateTo: e.target.value})}
            title="Fecha hasta"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="number"
              placeholder="Monto mín."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              value={overheadFilters.minAmount}
              onChange={(e) => setOverheadFilters({...overheadFilters, minAmount: e.target.value})}
            />
          </div>
          <input
            type="number"
            placeholder="Monto máx."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            value={overheadFilters.maxAmount}
            onChange={(e) => setOverheadFilters({...overheadFilters, maxAmount: e.target.value})}
          />
        </div>
      </div>
      
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          value={overheadFilters.sortBy}
          onChange={(e) => setOverheadFilters({...overheadFilters, sortBy: e.target.value as 'date' | 'name' | 'amount'})}
        >
          <option value="date">Ordenar por fecha</option>
          <option value="name">Ordenar por nombre</option>
          <option value="amount">Ordenar por monto</option>
        </select>
        
        <button
          onClick={() => setOverheadFilters({searchTerm: '', dateFrom: '', dateTo: '', minAmount: '', maxAmount: '', sortBy: 'date'})}
          className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );

  // 19. COMPONENTE DE FILTROS PARA MONASTERY EXPENSES
  const renderExpenseFilters = () => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
      <div className="flex items-center mb-4">
        <Filter className="text-red-600 mr-2" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">Filtros y Estadísticas</h3>
      </div>
      
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-red-600 font-medium">Total Gastos</p>
          <p className="text-2xl font-bold text-red-700">{expenseStats.total}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Monto Total S/.</p>
          <p className="text-2xl font-bold text-blue-700">{expenseStats.totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-600 font-medium">Promedio S/.</p>
          <p className="text-2xl font-bold text-green-700">{expenseStats.avgAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar gastos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={expenseFilters.searchTerm}
            onChange={(e) => setExpenseFilters({...expenseFilters, searchTerm: e.target.value})}
          />
        </div>

        <input
          type="text"
          placeholder="Categoría..."
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          value={expenseFilters.category}
          onChange={(e) => setExpenseFilters({...expenseFilters, category: e.target.value})}
        />
        
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              value={expenseFilters.dateFrom}
              onChange={(e) => setExpenseFilters({...expenseFilters, dateFrom: e.target.value})}
              title="Fecha desde"
            />
          </div>
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            value={expenseFilters.dateTo}
            onChange={(e) => setExpenseFilters({...expenseFilters, dateTo: e.target.value})}
            title="Fecha hasta"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="number"
              placeholder="Monto mín."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              value={expenseFilters.minAmount}
              onChange={(e) => setExpenseFilters({...expenseFilters, minAmount: e.target.value})}
            />
          </div>
          <input
            type="number"
            placeholder="Monto máx."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            value={expenseFilters.maxAmount}
            onChange={(e) => setExpenseFilters({...expenseFilters, maxAmount: e.target.value})}
          />
        </div>
      </div>
      
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          value={expenseFilters.sortBy}
          onChange={(e) => setExpenseFilters({...expenseFilters, sortBy: e.target.value as 'date' | 'name' | 'amount'})}
        >
          <option value="date">Ordenar por fecha</option>
          <option value="name">Ordenar por nombre</option>
          <option value="amount">Ordenar por monto</option>
        </select>
        
        <button
          onClick={() => setExpenseFilters({searchTerm: '', category: '', dateFrom: '', dateTo: '', minAmount: '', maxAmount: '', sortBy: 'date'})}
          className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );

  // 20. COMPONENTE PARA RENDERIZAR OVERHEADS
  const renderOverheads = () => (
    <div className="overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-semibold text-red-700">Gastos Generales</h2>
        <div className="flex flex-col sm:flex-row justify-end gap-2 w-full sm:w-auto">
          {(canCreate || isAdmin) && (
            <button
              onClick={() => setCreateOverheadModalOpen(true)}
              className="flex items-center justify-center bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-4 py-2 rounded-3xl whitespace-nowrap transition-all duration-300 shadow-lg"
            >
              <PlusCircle className="mr-2" /> Registrar Gasto General
            </button>
          )}
        </div>
      </div>
      
      {renderOverheadFilters()}
      
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-gray-700">
          <thead className="bg-gradient-to-r from-gray-700 to-gray-900 text-white">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2">Monto</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {overheadLoading && <tr key="overhead-loading"><td colSpan={6} className="text-center p-4">Cargando...</td></tr>}
            {overheadError && <tr key="overhead-error"><td colSpan={6} className="text-center p-4 text-red-500">Error: {overheadError.message}</td></tr>}
            {!overheadLoading && !overheadError && filteredOverheadData.length === 0 && (
              <tr key="overhead-no-data"><td colSpan={6} className="text-center p-8 text-gray-500">No hay gastos que mostrar con los filtros aplicados.</td></tr>
            )}
            {!overheadLoading && !overheadError && filteredOverheadData.map(overhead => (
              <tr key={overhead.id} className="border-b hover:bg-gray-50 transition-colors duration-200">
                <td className="px-4 py-2 font-medium">{overhead.name}</td>
                <td className="px-4 py-2">{overhead.description || '-'}</td>
                <td className="px-4 py-2">S/ {Number(overhead.amount).toFixed(2)}</td>
                <td className="px-4 py-2">{new Date(overhead.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {overhead.type}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-center space-x-2">
                    {(canEdit || isAdmin) && (
                      <button 
                        onClick={() => handleOpenEditOverheadModal(overhead)} 
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      >
                        <Edit size={16}/>
                      </button>
                    )}
                    {(canDelete || isAdmin) && (
                      <button 
                        onClick={() => handleOpenDeleteOverheadModal(overhead)} 
                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                      >
                        <Trash2 size={16}/>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 21. COMPONENTE PARA RENDERIZAR MONASTERY EXPENSES
  const renderExpenses = () => (
    <div className="overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-semibold text-red-700">Gastos de Monasterio</h2>
        <div className="flex flex-col sm:flex-row justify-end gap-2 w-full sm:w-auto">
          {(canCreate || isAdmin) && (
            <button
              onClick={handleOpenCreateExpenseModal}
              className="flex items-center justify-center bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-4 py-2 rounded-3xl whitespace-nowrap transition-all duration-300 shadow-lg"
            >
              <PlusCircle className="mr-2" /> Registrar Gasto del Monasterio
            </button>
          )}
        </div>
      </div>
      
      {renderExpenseFilters()}
      
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-gray-700">
          <thead className="bg-gradient-to-r from-gray-700 to-gray-900 text-white">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Categoría</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2">Monto</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {expenseLoading && <tr key="loading"><td colSpan={6} className="text-center p-4">Cargando...</td></tr>}
            {expenseError && <tr key="error"><td colSpan={6} className="text-center p-4 text-red-500">Error: {expenseError.message}</td></tr>}
            {!expenseLoading && !expenseError && filteredExpenseData.length === 0 && (
              <tr key="no-data"><td colSpan={6} className="text-center p-8 text-gray-500">No hay gastos que mostrar con los filtros aplicados.</td></tr>
            )}
            {!expenseLoading && !expenseError && filteredExpenseData.map(expense => (
              <tr key={expense.id} className="border-b hover:bg-gray-50 transition-colors duration-200">
                <td className="px-4 py-2 font-medium">{expense.Name}</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    {expense.category}
                  </span>
                </td>
                <td className="px-4 py-2">{expense.descripción}</td>
                <td className="px-4 py-2">S/ {Number(expense.amount).toFixed(2)}</td>
                <td className="px-4 py-2">{new Date(expense.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-center space-x-2">
                    {(canEdit || isAdmin) && (
                      <button 
                        onClick={() => handleOpenEditExpenseModal(expense)} 
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      >
                        <Edit size={16}/>
                      </button>
                    )}
                    {(canDelete || isAdmin) && (
                      <button 
                        onClick={() => handleOpenDeleteExpenseModal(expense)} 
                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                      >
                        <Trash2 size={16}/>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Switch de navegación con tema rojo degradado */}
      <div className="flex justify-center mb-6">
        <div className="bg-white rounded-full p-1 shadow-lg border border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveView('overheads')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeView === 'overheads'
                  ? 'bg-gradient-to-r from-red-500 to-red-700 text-white shadow-md transform scale-105'
                  : 'text-red-600 hover:bg-red-50'
              }`}
            >
              Gastos Generales
            </button>
            <button
              onClick={() => setActiveView('expenses')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeView === 'expenses'
                  ? 'bg-gradient-to-r from-red-500 to-red-700 text-white shadow-md transform scale-105'
                  : 'text-red-600 hover:bg-red-50'
              }`}
            >
              Gastos de Monasterio
            </button>
          </div>
        </div>
      </div>

      {/* Imagen de Santa Teresa */}
      <div className="flex justify-center mt-4 mb-6 md:mt-6 md:mb-8">
        <Image
          src="/santa teresa.jpg"
          alt="Santa Teresa"
          width={1900}
          height={500}
          className="rounded-xl shadow-md object-cover object-[center_60%] h-48 md:h-64 w-full"
        />
      </div>

      {/* 🔥 INDICADOR DE PERMISOS EN DESARROLLO */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Debug Permisos:</strong> 
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            Usuario: {(currentUserWithPermissions as any)?.name || 'No encontrado'} | 
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            Rol: {(currentUserWithPermissions as any)?.Role?.name || 'Sin rol'} | 
            Ver: {canView ? '✅' : '❌'} | 
            Editar: {canEdit ? '✅' : '❌'} | 
            Crear: {canCreate ? '✅' : '❌'} | 
            Eliminar: {canDelete ? '✅' : '❌'}
          </p>
        </div>
      )}

      {/* Renderizado condicional basado en la vista activa */}
      {activeView === 'overheads' ? renderOverheads() : renderExpenses()}

      {/* MODALES DE OVERHEADS (GASTOS GENERALES) - Solo se muestran en vista de overheads */}
      {activeView === 'overheads' && (
        <>
          <ModalCreateMonasteryExpense
            isOpen={isCreateOverheadModalOpen}
            onClose={() => setCreateOverheadModalOpen(false)}
          />
          <ModalEditMonasteryExpense
            isOpen={isEditOverheadModalOpen}
            onClose={() => setEditOverheadModalOpen(false)}
            overheadToEdit={selectedOverhead}
          />
          <ModalDeleteMonasteryExpense
            isOpen={isDeleteOverheadModalOpen}
            onClose={() => setDeleteOverheadModalOpen(false)}
            onConfirm={handleDeleteOverheadConfirm}
            isPending={deleteOverheadMutation.isPending}
            overheadName={selectedOverhead?.name || ''}
            overheadToEdit={selectedOverhead}
          />
        </>
      )}

      {/* MODALES DE MONASTERY EXPENSES (GASTOS DEL MONASTERIO) - Solo se muestran en vista de expenses */}
      {activeView === 'expenses' && (
        <>
          <ModalCreateExpense
            isOpen={isCreateExpenseModalOpen}
            onClose={() => setCreateExpenseModalOpen(false)}
          />
          <ModalEditExpense
            isOpen={isEditExpenseModalOpen}
            onClose={() => setEditExpenseModalOpen(false)}
            expenseToEdit={selectedExpense}
          />
          <ModalDeleteExpense
            isOpen={isDeleteExpenseModalOpen}
            onClose={() => setDeleteExpenseModalOpen(false)}
            onConfirm={handleDeleteExpenseConfirm}
            isPending={deleteMonasteryExpenseMutation.isPending}
            expenseName={selectedExpense?.Name || ''}
            expenseToDelete={selectedExpense}
          />
        </>
      )}

      {/* 🔥 MODAL DE ACCESO DENEGADO */}
      <AccessDeniedModal
        isOpen={showAccessDenied}
        onClose={() => setShowAccessDenied(false)}
        title="Permisos Insuficientes"
        message="No tienes permisos para realizar esta acción en la gestión del monasterio."
        action={accessDeniedAction}
        module="Gestión del Monasterio"
      />
    </div>
  );
};

export default MonasteryComponentView;