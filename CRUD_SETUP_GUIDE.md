# 📋 Guía Completa para Crear un Nuevo CRUD en el Módulo de Almacén

## 🔍 Análisis del Sistema Actual

He revisado el repositorio completo y he identificado los siguientes patrones y funcionalidades implementadas:

### ✅ Funcionalidades Actuales del Sistema

#### 1. **Sistema de Permisos Optimizado** 🔐
- Hook: `useModulePermissions(MODULE_NAMES.INVENTORY)`
- Permisos granulares: `canView`, `canCreate`, `canEdit`, `canDelete`, `isAdmin`
- Protección a nivel de UI (botones, modales, acciones)
- Verificación de estado de carga: `isLoading`

#### 2. **Gestión de Estado con React Query** 🔄
- Queries para obtener datos: `useQuery`
- Mutations para crear/actualizar/eliminar: `useMutation`
- Invalidación automática de caché con `queryClient.invalidateQueries`
- Manejo de estados: `isLoading`, `error`, `data`

#### 3. **Estructura de Componentes** 🧩
- **Vista Principal**: Tabla con filtros avanzados
- **Modales CRUD**: Crear, Editar, Eliminar
- **Validaciones**: Zod schemas + React Hook Form (opcional)
- **Responsive Design**: TailwindCSS con grid layouts

#### 4. **Patrones de Diseño Identificados** 🎨
- Modales con gradientes rojos corporativos
- Botones con iconos de Lucide React
- Estados visuales: loading, error, vacío
- Filtros avanzados: búsqueda, dropdown, fechas
- Paginación cuando es necesario
- Badges de estado (activo/inactivo)

---

## 📦 Checklist Completo para un Nuevo CRUD

### 1️⃣ **Definir el Tipo de Datos (Types)**
**Ubicación**: `src/modules/inventory/types/[entidad].d.ts`

```typescript
import { z } from 'zod';

// Schema de validación Zod
export const MiEntidadSchema = z.object({
  id: z.string().uuid(),
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
  precio: z.number().min(0, 'El precio debe ser mayor a 0'),
  categoria_id: z.string().uuid(),
  estado: z.boolean().default(true),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// Tipo TypeScript inferido
export type MiEntidad = z.infer<typeof MiEntidadSchema>;

// Payload para crear
export interface CreateMiEntidadPayload {
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria_id: string;
}

// Payload para actualizar
export interface UpdateMiEntidadPayload {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  categoria_id?: string;
  estado?: boolean;
}

// Tipo extendido con relaciones (si aplica)
export interface MiEntidadConRelaciones extends MiEntidad {
  categoria?: Categoria;
}
```

---

### 2️⃣ **Crear las Actions (API Calls)**
**Ubicación**: `src/modules/inventory/action/[entidad].ts`

```typescript
import api from '@/core/config/client';
import type { 
  MiEntidad, 
  CreateMiEntidadPayload, 
  UpdateMiEntidadPayload 
} from '../types/miEntidad.d';

// 🔹 OBTENER TODAS LAS ENTIDADES
export const fetchMiEntidades = async (): Promise<MiEntidad[]> => {
  const response = await api.get('/mi-entidad');
  
  // Manejo flexible de respuesta del backend
  if (response.data?.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  return Array.isArray(response.data) ? response.data : [];
};

// 🔹 OBTENER UNA ENTIDAD POR ID
export const getMiEntidad = async (id: string): Promise<MiEntidad> => {
  const response = await api.get(`/mi-entidad/${id}`);
  return response.data;
};

// 🔹 CREAR ENTIDAD
export const createMiEntidad = async (payload: CreateMiEntidadPayload): Promise<MiEntidad> => {
  const response = await api.post('/mi-entidad', payload);
  return response.data;
};

// 🔹 ACTUALIZAR ENTIDAD
export const updateMiEntidad = async (
  id: string, 
  payload: UpdateMiEntidadPayload
): Promise<MiEntidad> => {
  const response = await api.patch(`/mi-entidad/${id}`, payload);
  return response.data;
};

// 🔹 ELIMINAR/DESACTIVAR ENTIDAD (Soft delete)
export const deleteMiEntidad = async (id: string): Promise<void> => {
  await api.put(`/mi-entidad/${id}`, { estado: false });
};

// 🔹 O ELIMINAR PERMANENTE (Hard delete)
export const hardDeleteMiEntidad = async (id: string): Promise<void> => {
  await api.delete(`/mi-entidad/${id}`);
};
```

---

### 3️⃣ **Crear los Custom Hooks (React Query)**
**Ubicación**: `src/modules/inventory/hook/useMiEntidad.ts`

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { 
  MiEntidad, 
  CreateMiEntidadPayload, 
  UpdateMiEntidadPayload 
} from '../types/miEntidad.d';
import {
  fetchMiEntidades,
  getMiEntidad,
  createMiEntidad,
  updateMiEntidad,
  deleteMiEntidad,
} from '../action/miEntidad';

// 🔹 HOOK PARA OBTENER TODAS LAS ENTIDADES
export const useFetchMiEntidades = () => {
  return useQuery<MiEntidad[], Error>({
    queryKey: ['miEntidades'],
    queryFn: fetchMiEntidades,
  });
};

// 🔹 HOOK PARA OBTENER UNA ENTIDAD POR ID
export const useFetchMiEntidad = (id: string) => {
  return useQuery<MiEntidad, Error>({
    queryKey: ['miEntidad', id],
    queryFn: () => getMiEntidad(id),
    enabled: !!id, // Solo ejecutar si hay ID
  });
};

// 🔹 HOOK PARA CREAR
export const useCreateMiEntidad = () => {
  const queryClient = useQueryClient();
  return useMutation<MiEntidad, Error, CreateMiEntidadPayload>({
    mutationFn: createMiEntidad,
    onSuccess: () => {
      // Invalidar caché para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['miEntidades'] });
    },
  });
};

// 🔹 HOOK PARA ACTUALIZAR
export const useUpdateMiEntidad = () => {
  const queryClient = useQueryClient();
  return useMutation<MiEntidad, Error, { id: string; payload: UpdateMiEntidadPayload }>({
    mutationFn: ({ id, payload }) => updateMiEntidad(id, payload),
    onSuccess: (data, variables) => {
      // Invalidar caché de la lista y del item específico
      queryClient.invalidateQueries({ queryKey: ['miEntidades'] });
      queryClient.invalidateQueries({ queryKey: ['miEntidad', variables.id] });
    },
  });
};

// 🔹 HOOK PARA ELIMINAR
export const useDeleteMiEntidad = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteMiEntidad,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['miEntidades'] });
      queryClient.removeQueries({ queryKey: ['miEntidad', id] });
    },
  });
};
```

---

### 4️⃣ **Crear el Componente Vista Principal**
**Ubicación**: `src/modules/inventory/components/mi-entidad/mi-entidad-view.tsx`

```typescript
import React, { useState, useMemo } from "react";
import { Filter, PlusCircle, Edit, Trash, X } from "lucide-react";
import { 
  useFetchMiEntidades, 
  useDeleteMiEntidad 
} from "@/modules/inventory/hook/useMiEntidad";
import ModalCreateMiEntidad from './modal-create-mi-entidad';
import ModalEditMiEntidad from './modal-edit-mi-entidad';
import { useModulePermissions } from '@/core/utils/permission-hooks';
import { MODULE_NAMES } from '@/core/utils/useModulesMap';

const MiEntidadView: React.FC = () => {
  const { data: entidades, isLoading, error } = useFetchMiEntidades();
  const { mutate: deleteEntidad } = useDeleteMiEntidad();
  
  // 🔥 PERMISOS
  const { canView, canCreate, canEdit, canDelete, isAdmin } = 
    useModulePermissions(MODULE_NAMES.INVENTORY);

  // Estados
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("");

  // Entidad seleccionada para editar
  const selectedEntity = editingId
    ? entidades?.find((e) => e.id === editingId)
    : null;

  // Filtrado con useMemo
  const filteredEntidades = useMemo(() => {
    if (!entidades) return [];

    return entidades.filter((entidad) => {
      const matchesSearch = entidad.nombre
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter
        ? entidad.categoria_id === categoryFilter
        : true;

      return matchesSearch && matchesCategory;
    });
  }, [entidades, searchTerm, categoryFilter]);

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-500 rounded-lg">
        Error al cargar datos: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-semibold text-blue-700">
          Gestión de Mi Entidad
        </h2>
        
        {/* 🔥 BOTÓN CREAR - SOLO CON PERMISOS */}
        {(canCreate || isAdmin) && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-blue-700 text-white hover:bg-blue-800"
          >
            <PlusCircle size={18} /> Crear Nuevo
          </button>
        )}
      </div>

      {/* 🔥 DEBUG PERMISOS (solo development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Debug Permisos:</strong> 
            Crear: {canCreate ? '✅' : '❌'} | 
            Editar: {canEdit ? '✅' : '❌'} | 
            Eliminar: {canDelete ? '✅' : '❌'} |
            Admin: {isAdmin ? '✅' : '❌'}
          </p>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow p-4 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Filter className="text-gray-600" size={20} />
            <h3 className="text-lg font-medium text-gray-800">Filtros</h3>
          </div>
          <button
            onClick={clearFilters}
            className="text-gray-600 hover:text-gray-800 flex items-center px-2 py-1 rounded hover:bg-gray-100"
          >
            <X className="mr-1 h-4 w-4" /> Limpiar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Filtro categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Todas las categorías</option>
              {/* Opciones dinámicas aquí */}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 text-center">Nombre</th>
              <th className="px-4 py-2 text-center">Descripción</th>
              <th className="px-4 py-2 text-center">Precio</th>
              <th className="px-4 py-2 text-center">Estado</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntidades.length > 0 ? (
              filteredEntidades.map((entidad) => (
                <tr key={entidad.id} className="hover:bg-gray-50 border-t">
                  <td className="px-4 py-2 text-center">{entidad.nombre}</td>
                  <td className="px-4 py-2 text-center">{entidad.descripcion || '-'}</td>
                  <td className="px-4 py-2 text-center">${entidad.precio}</td>
                  <td className="px-4 py-2 text-center">
                    {entidad.estado ? (
                      <span className="text-green-600 font-semibold">Activo</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Inactivo</span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex justify-center gap-2">
                    {/* 🔥 BOTONES CON PERMISOS */}
                    {(canEdit || isAdmin) && (
                      <button
                        onClick={() => setEditingId(entidad.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>
                    )}
                    
                    {(canDelete || isAdmin) && (
                      <button
                        onClick={() => deleteEntidad(entidad.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash size={18} />
                      </button>
                    )}

                    {!canEdit && !canDelete && !isAdmin && (
                      <span className="text-gray-400 text-sm">Sin permisos</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  {searchTerm || categoryFilter
                    ? "No se encontraron resultados"
                    : "No hay registros"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modales */}
      {showCreate && (canCreate || isAdmin) && (
        <ModalCreateMiEntidad onClose={() => setShowCreate(false)} />
      )}

      {editingId && selectedEntity && (canEdit || isAdmin) && (
        <ModalEditMiEntidad
          entidad={selectedEntity}
          onClose={() => setEditingId(null)}
        />
      )}
    </div>
  );
};

export default MiEntidadView;
```

---

### 5️⃣ **Crear Modal de Crear**
**Ubicación**: `src/modules/inventory/components/mi-entidad/modal-create-mi-entidad.tsx`

```typescript
import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useCreateMiEntidad } from '../../hook/useMiEntidad';

type ModalCreateProps = {
  onClose: () => void;
};

const ModalCreateMiEntidad: React.FC<ModalCreateProps> = ({ onClose }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState<number | ''>('');
  const [categoriaId, setCategoriaId] = useState('');
  const [error, setError] = useState('');

  const { mutate, status } = useCreateMiEntidad();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    if (precio === '' || Number(precio) < 0) {
      setError('El precio debe ser mayor o igual a 0');
      return;
    }
    if (!categoriaId) {
      setError('Debe seleccionar una categoría');
      return;
    }

    setError('');
    mutate(
      {
        nombre,
        descripcion,
        precio: Number(precio),
        categoria_id: categoriaId,
      },
      {
        onSuccess: onClose,
        onError: () => setError('Error al crear el registro'),
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header con gradiente rojo */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-5 rounded-t-2xl flex items-center justify-center relative">
          <h2 className="text-lg font-semibold">Crear Nueva Entidad</h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-200"
          >
            <X size={22} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          {/* Nombre */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Nombre<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Nombre de la entidad"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Descripción opcional"
              rows={3}
            />
          </div>

          {/* Precio */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Precio<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="0.00"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Categoría<span className="text-red-500">*</span>
            </label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Seleccione una categoría</option>
              {/* Opciones dinámicas aquí */}
            </select>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={status === 'pending'}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2"
            >
              <Save size={18} />
              <span>{status === 'pending' ? 'Guardando...' : 'Guardar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateMiEntidad;
```

---

### 6️⃣ **Crear Modal de Editar**
**Ubicación**: `src/modules/inventory/components/mi-entidad/modal-edit-mi-entidad.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useUpdateMiEntidad } from '../../hook/useMiEntidad';
import type { MiEntidad } from '../../types/miEntidad.d';

type ModalEditProps = {
  entidad: MiEntidad;
  onClose: () => void;
};

const ModalEditMiEntidad: React.FC<ModalEditProps> = ({ entidad, onClose }) => {
  const [nombre, setNombre] = useState(entidad.nombre);
  const [descripcion, setDescripcion] = useState(entidad.descripcion || '');
  const [precio, setPrecio] = useState<number>(entidad.precio);
  const [categoriaId, setCategoriaId] = useState(entidad.categoria_id);
  const [error, setError] = useState('');

  const { mutate, status } = useUpdateMiEntidad();

  // Sincronizar con datos externos si cambian
  useEffect(() => {
    setNombre(entidad.nombre);
    setDescripcion(entidad.descripcion || '');
    setPrecio(entidad.precio);
    setCategoriaId(entidad.categoria_id);
  }, [entidad]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    setError('');
    mutate(
      {
        id: entidad.id,
        payload: {
          nombre,
          descripcion,
          precio,
          categoria_id: categoriaId,
        },
      },
      {
        onSuccess: onClose,
        onError: () => setError('Error al actualizar el registro'),
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-5 rounded-t-2xl flex items-center justify-center relative">
          <h2 className="text-lg font-semibold">Editar Entidad</h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-200"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Nombre<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Precio<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={status === 'pending'}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2"
            >
              <Save size={18} />
              <span>{status === 'pending' ? 'Actualizando...' : 'Actualizar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditMiEntidad;
```

---

## 🎯 Resumen de lo que Necesito para Conectar un Nuevo CRUD

Para implementar un **nuevo CRUD completo en el módulo de Almacén**, necesito que me proporciones:

### 📝 Información del Backend
1. **Endpoint de la API** (ej: `/productos`, `/categorias`, `/lotes`)
2. **Estructura de datos que devuelve el backend**:
   ```json
   {
     "id": "uuid",
     "nombre": "string",
     "campo1": "tipo",
     "campo2": "tipo",
     "created_at": "datetime",
     "status": "boolean"
   }
   ```
3. **Campos requeridos vs opcionales**
4. **Relaciones con otras entidades** (si aplica)
5. **Tipo de eliminación**: Soft delete (cambio de estado) o Hard delete (eliminación física)

### 🎨 Información de UI/UX
1. **Nombre del módulo** (ej: "Lotes", "Categorías", "Stock Mínimo")
2. **Campos del formulario** con sus tipos:
   - Texto, número, fecha, select, textarea, checkbox, etc.
3. **Filtros necesarios** en la vista de lista
4. **Relaciones a mostrar** (ej: mostrar nombre de categoría en lugar de ID)
5. **Validaciones especiales** (ej: precio mayor a 0, fecha no futura)

### 🔧 Configuración
1. **Permisos necesarios** (¿usa los del módulo INVENTORY o necesita uno nuevo?)
2. **Paginación**: ¿necesita paginación o no?
3. **Ordenamiento por defecto**
4. **Estados de los registros** (activo/inactivo, pendiente/aprobado, etc.)

---

## 🚀 Implementación Rápida

Una vez me proporciones esta información, puedo:

1. ✅ Crear el archivo de **types** con Zod schemas
2. ✅ Crear las **actions** con llamadas a la API
3. ✅ Crear los **custom hooks** con React Query
4. ✅ Crear el **componente de vista** con tabla y filtros
5. ✅ Crear los **modales** de crear y editar
6. ✅ Integrar el **sistema de permisos**
7. ✅ Añadir **validaciones** y manejo de errores

---

## 📌 Ejemplo Rápido

**Si me dices:**
> "Quiero un CRUD de Lotes que tenga: número de lote, producto asociado, cantidad, fecha de vencimiento y proveedor. El endpoint es `/lotes`"

**Yo puedo generar:**
- `types/lote.d.ts` con schema Zod
- `action/lotes.ts` con CRUD completo
- `hook/useLotes.ts` con React Query
- `components/lotes/lote-view.tsx` con tabla y filtros
- `components/lotes/modal-create-lote.tsx` 
- `components/lotes/modal-edit-lote.tsx`

Todo **siguiendo los patrones actuales del proyecto** y con **protección de permisos** integrada.

---

## 💡 Siguiente Paso

**¿Qué CRUD necesitas implementar?** Dame los detalles del backend y la funcionalidad que necesitas, y te genero todo el código necesario siguiendo estos patrones.
