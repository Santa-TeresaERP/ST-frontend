import React, { useState, useEffect, useCallback } from "react";
import { Button } from "../../../app/components/ui/button";
import { Card } from "../../../app/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "../../../app/components/ui/dialog";
import { ShieldCheck, Eye, Edit, Trash2, Plus, X, AlertCircle, Save, Menu } from "lucide-react"; // Importar el icono Menu
import { useFetchPermissionsByRole } from "../hook/usePermissions";
import { useQueryClient } from "@tanstack/react-query";

interface Module {
  id: string;
  name: string;
  description?: string;
}

interface PermissionData {
  canRead: boolean;
  canWrite: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

interface ExistingPermission {
  moduleId: string;
  canRead: boolean;
  canWrite: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

interface Role {
  id: string;
  name: string;
}

interface PermissionEditorProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  modules: Module[];
  onSubmit: (data: { id: string; permissions: { moduleId: string; canRead: boolean; canWrite: boolean; canUpdate: boolean; canDelete: boolean }[] }) => Promise<void>;
}

const PermissionEditor: React.FC<PermissionEditorProps> = ({ isOpen, onClose, role, modules, onSubmit }) => {
  const queryClient = useQueryClient();
  const [allPermissions, setAllPermissions] = useState<{ [moduleId: string]: PermissionData }>({});
  const [originalPermissions, setOriginalPermissions] = useState<{ [moduleId: string]: PermissionData }>({});
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [modifiedModules, setModifiedModules] = useState<Set<string>>(new Set());
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [permissionsError, setPermissionsError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Nuevo estado para la barra lateral desplegable

  // Obtener permisos existentes del backend usando el hook existente
  const { data: existingPermissions, isLoading: hookIsLoading, error: hookError } = useFetchPermissionsByRole(role?.id || null);

  // 🔍 DEBUG: Log de los permisos existentes
  useEffect(() => {
    if (role?.id) {
      console.log('🔍 DEBUG - Hook de permisos:', {
        roleId: role.id,
        roleName: role.name,
        existingPermissions,
        existingPermissionsStringified: JSON.stringify(existingPermissions, null, 2),
        isLoading: hookIsLoading,
        error: hookError,
        dataIsArray: Array.isArray(existingPermissions),
        dataLength: existingPermissions?.length || 0
      });

      if (existingPermissions && Array.isArray(existingPermissions) && existingPermissions.length > 0) {
        console.log('🔍 DEBUG - Permisos individuales:');
        existingPermissions.forEach((perm, index) => {
          console.log(`  [${index}] Permiso:`, {
            moduleId: perm.moduleId,
            canRead: perm.canRead,
            canWrite: perm.canWrite,
            canUpdate: perm.canUpdate,
            canDelete: perm.canDelete,
            hasCanUpdate: 'canUpdate' in perm,
            hasCanEdit: 'canEdit' in (perm as Record<string, unknown>),
            fullObject: perm
          });
        });
      }
    }
  }, [role?.id, role?.name, existingPermissions, hookIsLoading, hookError]);

  const loadRolePermissions = useCallback(async () => {
    if (!role?.id || !isOpen || modules.length === 0) return;

    console.log('🔍 Cargando permisos completos del rol...', {
      roleId: role.id,
      roleName: role.name,
      totalModules: modules.length,
      existingPermissions,
      existingPermissionsType: typeof existingPermissions,
      isArray: Array.isArray(existingPermissions)
    });

    setIsLoadingPermissions(true);
    setPermissionsError(null);

    try {
      const initialPermissions: { [moduleId: string]: PermissionData } = {};

      modules.forEach((module) => {
        initialPermissions[module.id] = {
          canRead: false,
          canWrite: false,
          canUpdate: false,
          canDelete: false,
        };
      });

      if (existingPermissions && Array.isArray(existingPermissions)) {
        console.log('📋 APLICANDO permisos existentes:', existingPermissions);

        existingPermissions.forEach((permission: ExistingPermission) => {
          console.log('🔄 Procesando permiso existente:', {
            moduleId: permission.moduleId,
            canRead: permission.canRead,
            canWrite: permission.canWrite,
            canUpdate: permission.canUpdate,
            canDelete: permission.canDelete
          });

          if (initialPermissions[permission.moduleId]) {
            const before = JSON.parse(JSON.stringify(initialPermissions[permission.moduleId]));
            initialPermissions[permission.moduleId] = {
              canRead: permission.canRead || false,
              canWrite: permission.canWrite || false,
              canUpdate: permission.canUpdate || false,
              canDelete: permission.canDelete || false,
            };
            const after = initialPermissions[permission.moduleId];

            console.log('✅ Permiso aplicado:', {
              moduleId: permission.moduleId,
              before,
              after
            });
          } else {
            console.log('⚠️ Módulo no encontrado para permiso:', permission.moduleId);
          }
        });

        console.log('🔄 Permisos existentes aplicados:', {
          existingCount: existingPermissions.length,
          appliedPermissions: existingPermissions
        });
      } else {
        console.log('⚠️ No hay permisos existentes o no es un array:', {
          existingPermissions,
          type: typeof existingPermissions,
          isArray: Array.isArray(existingPermissions)
        });
      }

      console.log('✅ Permisos inicializados completos:', initialPermissions);

      setAllPermissions(initialPermissions);
      setOriginalPermissions(JSON.parse(JSON.stringify(initialPermissions))); // Deep copy
      setModifiedModules(new Set());

    } catch (error) {
      console.error('❌ Error cargando permisos del rol:', error);
      setPermissionsError('Error al cargar permisos del rol');
    } finally {
      setIsLoadingPermissions(false);
    }
  }, [role?.id, role?.name, isOpen, modules, existingPermissions]);

  const selectInitialModule = useCallback(() => {
    if (modules.length > 0 && !selectedModule) {
      setSelectedModule(modules[0].id);
    }
  }, [modules, selectedModule]);

  useEffect(() => {
    console.log('🎯 useEffect - Evaluando si cargar permisos:', {
      isOpen,
      hasRole: !!role,
      modulesLength: modules.length,
      hookIsLoading,
      hasExistingPermissions: !!existingPermissions,
      existingPermissionsLength: existingPermissions?.length || 0
    });

    if (isOpen && role && modules.length > 0 && !hookIsLoading) {
      console.log('✅ Ejecutando loadRolePermissions...');
      loadRolePermissions();
    } else {
      console.log('❌ NO se ejecuta loadRolePermissions por condiciones no cumplidas');
    }
  }, [isOpen, role, modules, existingPermissions, hookIsLoading, loadRolePermissions]);

  useEffect(() => {
    selectInitialModule();
  }, [selectInitialModule]);

  useEffect(() => {
    if (hookError) {
      setPermissionsError(hookError.message);
      setIsLoadingPermissions(false);
    }
  }, [hookError]);

  const updatePermission = (moduleId: string, permissionType: keyof PermissionData, value: boolean) => {
    console.log('🔄 Actualizando permiso localmente:', {
      module: modules.find(m => m.id === moduleId)?.name,
      permission: permissionType,
      value,
      moduleId
    });

    const updatedPermissions = {
      ...allPermissions,
      [moduleId]: {
        ...allPermissions[moduleId],
        [permissionType]: value
      }
    };

    setAllPermissions(updatedPermissions);

    const original = originalPermissions[moduleId] || { canRead: false, canWrite: false, canUpdate: false, canDelete: false };
    const current = updatedPermissions[moduleId];

    const hasChanged = (
      original.canRead !== current.canRead ||
      original.canWrite !== current.canWrite ||
      original.canUpdate !== current.canUpdate ||
      original.canDelete !== current.canDelete
    );

    setModifiedModules(prev => {
      const newModified = new Set(prev);
      if (hasChanged) {
        newModified.add(moduleId);
      } else {
        newModified.delete(moduleId);
      }
      return newModified;
    });

    console.log('✅ Permiso actualizado localmente. Solo se guardará al presionar "Guardar Cambios"', {
      totalModifiedModules: hasChanged ? modifiedModules.size + 1 : modifiedModules.size,
      currentModule: modules.find(m => m.id === moduleId)?.name,
      permissions: updatedPermissions[moduleId]
    });
  };

  const saveChangesToBackend = async () => {
    if (!role?.id || modifiedModules.size === 0) {
      console.log('⚠️ No hay cambios para guardar');
      return false;
    }

    try {
      const allPermissionsArray = modules.map(module => ({
        moduleId: module.id,
        canRead: allPermissions[module.id]?.canRead || false,
        canWrite: allPermissions[module.id]?.canWrite || false,
        canUpdate: allPermissions[module.id]?.canUpdate || false,
        canDelete: allPermissions[module.id]?.canDelete || false
      }));

      console.log('🚀 Guardando TODOS los permisos manualmente...', {
        roleId: role.id,
        totalModules: allPermissionsArray.length,
        modifiedModules: Array.from(modifiedModules),
        permissions: allPermissionsArray
      });

      await onSubmit({
        id: role.id,
        permissions: allPermissionsArray
      });

      console.log('✅ Permisos guardados exitosamente (manual)');

      await queryClient.invalidateQueries({
        queryKey: ["permissions", "role", role.id]
      });

      console.log('🔄 Query invalidada, los permisos se recargaran automáticamente');

      await new Promise(resolve => setTimeout(resolve, 500));

      setOriginalPermissions(JSON.parse(JSON.stringify(allPermissions)));
      setModifiedModules(new Set());

      return true;

    } catch (error) {
      console.error('❌ Error guardando permisos (manual):', error);
      return false;
    }
  };

  const handleReset = () => {
    setAllPermissions(JSON.parse(JSON.stringify(originalPermissions)));
    setModifiedModules(new Set());
  };

  const handleSaveChanges = async () => {
    await saveChangesToBackend();
  };

  const handleCloseModal = () => {
    if (role?.id) {
      queryClient.invalidateQueries({
        queryKey: ["permissions", "role", role.id]
      });
    }
    onClose();
  };

  if (!isOpen || !role) return null;

  const isLoading = isLoadingPermissions || hookIsLoading;
  const hasError = permissionsError || hookError;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseModal()}>
      <DialogContent className="w-full max-w-[95%] sm:max-w-[1000px] h-[90vh] rounded-xl shadow-lg px-0 pb-0 pt-0 flex flex-col">

        <div className="w-full bg-gradient-to-r from-green-600 to-green-500 rounded-t-xl px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-white hover:bg-white/10"
              title="Abrir módulos"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <ShieldCheck className="h-6 w-6 text-white" />
            <DialogTitle className="text-xl font-semibold text-white">
              Gestionar Permisos - {role.name}
            </DialogTitle>
          </div>

          {modifiedModules.size > 0 && (
            <div className="bg-white/20 rounded-full px-3 py-1">
              <span className="text-sm text-white font-medium">
                {modifiedModules.size} cambio{modifiedModules.size !== 1 ? 's' : ''} pendiente{modifiedModules.size !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className={`
              ${isSidebarOpen ? 'fixed inset-0 z-50 bg-white flex' : 'hidden md:flex'}
              w-full md:w-80 border-r bg-gray-50 flex-shrink-0 flex-col
              ${isSidebarOpen ? 'py-4 px-2' : ''} /* Añadir padding cuando está abierta en móvil */
          `}>
            <div className="px-4 py-3 border-b bg-white flex-shrink-0 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Módulos del Sistema</h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden text-gray-700 hover:bg-gray-100"
                title="Cerrar módulos"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                  <span className="ml-2 text-sm text-gray-600">Cargando permisos...</span>
                </div>
              ) : hasError ? (
                <div className="p-4 text-center text-red-600">
                  <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm">Error cargando permisos</p>
                  <p className="text-xs text-gray-500 mt-1">{typeof hasError === 'string' ? hasError : hasError?.message}</p>
                </div>
              ) : (
                modules.map((module) => {
                  const isSelected = selectedModule === module.id;
                  const isModified = modifiedModules.has(module.id);
                  const modulePermissions = allPermissions[module.id];
                  const hasPermissions = modulePermissions && (
                    modulePermissions.canRead ||
                    modulePermissions.canWrite ||
                    modulePermissions.canUpdate ||
                    modulePermissions.canDelete
                  );

                  return (
                    <Card
                      key={module.id}
                      className={`mb-2 p-3 cursor-pointer transition-all hover:shadow-md ${
                        isSelected
                          ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedModule(module.id);
                        setIsSidebarOpen(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className={`font-medium ${isSelected ? 'text-green-800' : 'text-gray-800'}`}>
                            {module.name}
                          </h4>
                          {module.description && (
                            <p className="text-xs text-gray-500 mt-1">{module.description}</p>
                          )}
                        </div>

                        <div className="flex items-center space-x-1">
                          {hasPermissions && (
                            <div className="w-2 h-2 rounded-full bg-green-500" title="Tiene permisos activos"></div>
                          )}
                          {isModified && (
                            <div className="w-2 h-2 rounded-full bg-blue-500" title="Modificado"></div>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedModule && allPermissions[selectedModule] !== undefined ? (
              <>
                <div className="px-6 py-4 border-b bg-white flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {modules.find(m => m.id === selectedModule)?.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Haz múltiples cambios, luego guarda con el botón inferior
                      </p>
                    </div>

                    {modifiedModules.has(selectedModule) && (
                      <div className="text-blue-600 text-sm font-medium">
                        ● Modificado
                      </div>
                    )}
                  </div>
                </div>

                {/* Div con scroll para los switches de permisos */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="grid gap-6 max-w-2xl">

                    {/* Leer */}
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
                      <div className="flex items-center space-x-3">
                        <Eye className="h-6 w-6 text-blue-500" />
                        <div>
                          <h4 className="font-medium text-gray-800">Leer / Consultar</h4>
                          <p className="text-sm text-gray-600">Ver información del módulo</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={allPermissions[selectedModule]?.canRead || false}
                          onChange={(e) => updatePermission(selectedModule, 'canRead', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* Escribir */}
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
                      <div className="flex items-center space-x-3">
                        <Plus className="h-6 w-6 text-green-500" />
                        <div>
                          <h4 className="font-medium text-gray-800">Crear / Escribir</h4>
                          <p className="text-sm text-gray-600">Crear nuevos registros</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={allPermissions[selectedModule]?.canWrite || false}
                          onChange={(e) => updatePermission(selectedModule, 'canWrite', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    {/* Actualizar */}
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
                      <div className="flex items-center space-x-3">
                        <Edit className="h-6 w-6 text-purple-500" />
                        <div>
                          <h4 className="font-medium text-gray-800">Actualizar / Editar</h4>
                          <p className="text-sm text-gray-600">Modificar registros existentes</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={allPermissions[selectedModule]?.canUpdate || false}
                          onChange={(e) => updatePermission(selectedModule, 'canUpdate', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    {/* Eliminar */}
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
                      <div className="flex items-center space-x-3">
                        <Trash2 className="h-6 w-6 text-red-500" />
                        <div>
                          <h4 className="font-medium text-gray-800">Eliminar</h4>
                          <p className="text-sm text-gray-600">Eliminar registros permanentemente</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={allPermissions[selectedModule]?.canDelete || false}
                          onChange={(e) => updatePermission(selectedModule, 'canDelete', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>

                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <ShieldCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>
                    {isLoading
                      ? "Cargando permisos..."
                      : "Selecciona un módulo para editar sus permisos"
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="border-t px-6 py-4 bg-gray-50 rounded-b-xl flex flex-row gap-4 flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleCloseModal}
            className="border-gray-400 text-gray-700 hover:bg-gray-200"
          >
            <X className="h-4 w-4 mr-2" />
            Cerrar
          </Button>

          {modifiedModules.size > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="border-gray-400 text-gray-700 hover:bg-gray-200"
            >
              Deshacer {modifiedModules.size} cambio{modifiedModules.size !== 1 ? 's' : ''}
            </Button>
          )}

          <Button
            type="button"
            onClick={handleSaveChanges}
            disabled={modifiedModules.size === 0}
            className={`${
              modifiedModules.size > 0
                ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            <Save className="h-4 w-4 mr-2" />
            {modifiedModules.size > 0 ? `Guardar ${modifiedModules.size} cambio${modifiedModules.size !== 1 ? 's' : ''}` : 'Sin cambios'}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
};

export default PermissionEditor;