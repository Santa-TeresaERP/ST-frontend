"use client";

import React, { useMemo, useState } from "react";
import {
  PlusCircle,
  Edit,
  Trash2,
  Filter,
  Calendar,
  Search,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import ModalCreateDonativo from "../components/donativos/modal-create-view";
import ModalEditDonativo from "../components/donativos/modal-update-view";
import ModalDeleteDonativo from "../components/donativos/modal-delete-view";
import RentView from "./rentas/rent-view";
import useFetchIncomes from "../hook/IncomeChurch/useFetchIncomes";
import useCreateIncome from "../hook/IncomeChurch/useCreateIncome";
import useUpdateIncome from "../hook/IncomeChurch/useUpdateIncome";
import useDeleteIncome from "../hook/IncomeChurch/useDeleteIncome";
import useFetchDefaultChurch from "../hook/IncomeChurch/useFetchDefaultChurch";
import type { IncomeChurch } from "../types/incomeChurch";

type TabType = "donativos" | "reservas";

type DonativosFilters = {
  searchTerm: string;
  dateFrom: string;
  dateTo: string;
  minAmount: string;
  maxAmount: string;
  sortBy: "fecha" | "nombre" | "precio";
};

const ITEMS_PER_PAGE = 10;

const ChurchComponentView = () => {
  const [activeTab, setActiveTab] = useState<TabType>("donativos");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<DonativosFilters>({
    searchTerm: "",
    dateFrom: "",
    dateTo: "",
    minAmount: "",
    maxAmount: "",
    sortBy: "fecha",
  });
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDonativo, setSelectedDonativo] = useState<IncomeChurch | null>(
    null,
  );

  const {
    data: donativos = [],
    loading: loadingDonativos,
    refetch: refetchIncomes,
  } = useFetchIncomes();
  const { churchId, loading: loadingChurch } = useFetchDefaultChurch();
  const { create: createIncome } = useCreateIncome();
  const { update: updateIncome } = useUpdateIncome();
  const { remove: removeIncome, loading: deletingIncome } = useDeleteIncome();

  const filteredDonativos = useMemo(() => {
    let result = [...donativos];

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.type.toLowerCase().includes(term),
      );
    }

    if (filters.dateFrom) {
      result = result.filter(
        (item) => new Date(item.date) >= new Date(filters.dateFrom),
      );
    }

    if (filters.dateTo) {
      result = result.filter(
        (item) => new Date(item.date) <= new Date(filters.dateTo),
      );
    }

    if (filters.minAmount) {
      result = result.filter(
        (item) => item.price >= Number(filters.minAmount),
      );
    }

    if (filters.maxAmount) {
      result = result.filter(
        (item) => item.price <= Number(filters.maxAmount),
      );
    }

    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "nombre":
          return a.name.localeCompare(b.name);
        case "precio":
          return b.price - a.price;
        case "fecha":
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return result;
  }, [donativos, filters]);

  const stats = useMemo(() => {
    const total = filteredDonativos.reduce((sum, item) => sum + item.price, 0);
    const avg = filteredDonativos.length
      ? total / filteredDonativos.length
      : 0;

    return {
      total,
      avg,
      count: filteredDonativos.length,
    };
  }, [filteredDonativos]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDonativos.length / ITEMS_PER_PAGE),
  );

  const paginatedDonativos = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDonativos.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDonativos, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const resetPagination = () => setCurrentPage(1);

  const handleFilterChange = <T extends keyof DonativosFilters>(
    key: T,
    value: DonativosFilters[T],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    resetPagination();
  };

  const handleClearFilters = () => {
    setFilters({
      searchTerm: "",
      dateFrom: "",
      dateTo: "",
      minAmount: "",
      maxAmount: "",
      sortBy: "fecha",
    });
    resetPagination();
  };

  const handleCreateSubmit = async (formData: any) => {
    if (!churchId) {
      console.error("No se pudo determinar la iglesia por defecto.");
      return;
    }

    const payload = {
      name: formData.nombre,
      type: formData.tipo,
      price: Number(formData.precio),
      date: new Date(formData.fecha).toISOString(),
      idChurch: churchId,
    };

    const created = await createIncome(payload);
    if (created) {
      await refetchIncomes();
      setCreateModalOpen(false);
      resetPagination();
    }
  };

  const handleEditSubmit = async (id: string | number, formData: any) => {
    const payload = {
      name: formData.nombre,
      type: formData.tipo,
      price: Number(formData.precio),
      date: new Date(formData.fecha).toISOString(),
    };

    const updated = await updateIncome(String(id), payload);
    if (updated) {
      await refetchIncomes();
      setEditModalOpen(false);
      setSelectedDonativo(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDonativo) return;

    const removed = await removeIncome(String(selectedDonativo.id));
    if (removed) {
      await refetchIncomes();
      setDeleteModalOpen(false);
      setSelectedDonativo(null);
      resetPagination();
    }
  };

  const renderDonativosFilters = () => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
      <div className="flex items-center mb-4">
        <Filter className="text-red-600 mr-2" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">
          Filtros y estadísticas
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-red-600 font-medium">Total Donativos</p>
          <p className="text-2xl font-bold text-red-700">{stats.count}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Monto Total S/.</p>
          <p className="text-2xl font-bold text-blue-700">
            {stats.total.toFixed(2)}
          </p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-600 font-medium">Promedio S/.</p>
          <p className="text-2xl font-bold text-green-700">
            {stats.avg.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative md:col-span-2 lg:col-span-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Buscar donativos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              title="Fecha desde"
            />
          </div>
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange("dateTo", e.target.value)}
            title="Fecha hasta"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <DollarSign
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="number"
              placeholder="Min S/."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              value={filters.minAmount}
              onChange={(e) => handleFilterChange("minAmount", e.target.value)}
            />
          </div>
          <input
            type="number"
            placeholder="Max S/."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            value={filters.maxAmount}
            onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          value={filters.sortBy}
          onChange={(e) =>
            handleFilterChange("sortBy", e.target.value as DonativosFilters["sortBy"])
          }
        >
          <option value="fecha">Ordenar por fecha</option>
          <option value="nombre">Ordenar por nombre</option>
          <option value="precio">Ordenar por monto</option>
        </select>

        <button
          onClick={handleClearFilters}
          className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );

  const renderDonativosTable = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gray-700 text-white">
        <div className="grid grid-cols-6 gap-4 px-6 py-4">
          <div className="font-semibold text-center">Nombre</div>
          <div className="font-semibold text-center">Precio</div>
          <div className="font-semibold text-center">Tipo</div>
          <div className="font-semibold text-center">Fecha</div>
          <div className="font-semibold text-center">Estado</div>
          <div className="font-semibold text-center">Acciones</div>
        </div>
      </div>

      {loadingDonativos ? (
        <div className="py-12 text-center text-gray-500 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
          Cargando donativos...
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {paginatedDonativos.length > 0 ? (
            paginatedDonativos.map((donativo, index) => (
              <div
                key={donativo.id}
                className={`grid grid-cols-6 gap-4 px-6 py-5 transition-colors duration-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-red-50`}
              >
                <div className="text-gray-800 font-medium text-center">
                  {donativo.name}
                </div>
                <div className="text-gray-800 font-medium text-center">
                  S/. {donativo.price.toFixed(2)}
                </div>
                <div className="text-gray-700 text-center">{donativo.type}</div>
                <div className="text-gray-700 text-center">
                  {new Date(donativo.date).toLocaleDateString("es-PE")}
                </div>
                <div className="text-gray-600 text-sm text-center">
                  {donativo.status ? "Activo" : "Inactivo"}
                </div>
                <div className="flex justify-center items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedDonativo(donativo);
                      setEditModalOpen(true);
                    }}
                    className="p-2 rounded-full bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700 transition-all duration-200 hover:scale-110"
                    title="Editar"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDonativo(donativo);
                      setDeleteModalOpen(true);
                    }}
                    className="p-2 rounded-full bg-red-100 hover:bg-red-600 text-red-600 hover:text-white transition-all duration-200 hover:scale-110"
                    title="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              No hay donativos con los filtros aplicados.
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderPagination = () => (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={20} />
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`w-10 h-10 rounded-full text-sm font-semibold transition-colors duration-200 ${
              number === currentPage
                ? "bg-red-600 text-white shadow-md"
                : "text-gray-700 bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {number}
          </button>
        ),
      )}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-red-700 mb-2">Iglesia</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-red-800 mx-auto rounded-full" />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-2 max-w-3xl mx-auto">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setActiveTab("donativos");
                resetPagination();
              }}
              className={`py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                activeTab === "donativos"
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Donativos y limosnas
            </button>
            <button
              onClick={() => {
                setActiveTab("reservas");
                resetPagination();
              }}
              className={`py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                activeTab === "reservas"
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Reservas y eventos
            </button>
          </div>
        </div>

        {activeTab === "donativos" ? (
          <div className="space-y-6">
            {!churchId && !loadingChurch && (
              <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl">
                <AlertCircle className="w-5 h-5 mt-0.5" />
                <p className="text-sm">
                  Debes configurar una iglesia por defecto para registrar
                  donativos.
                </p>
              </div>
            )}

            <div className="flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-3xl font-bold text-red-700">
                Donativos y limosnas
              </h2>
              <button
                onClick={() => setCreateModalOpen(true)}
                disabled={!churchId}
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusCircle className="w-5 h-5" />
                Registrar donativo
              </button>
            </div>

            {renderDonativosFilters()}
            {renderDonativosTable()}
            {totalPages > 1 && renderPagination()}
          </div>
        ) : (
          <RentView />
        )}
      </div>

      <ModalCreateDonativo
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      <ModalEditDonativo
        isOpen={isEditModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedDonativo(null);
        }}
        onSubmit={handleEditSubmit}
        donativoToEdit={selectedDonativo}
      />

      <ModalDeleteDonativo
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedDonativo(null);
        }}
        onConfirm={handleDeleteConfirm}
        isPending={deletingIncome}
        donativoData={selectedDonativo}
      />
    </div>
  );
};

export default ChurchComponentView;
