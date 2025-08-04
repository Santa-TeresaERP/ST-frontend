import React, { useState, useEffect, useCallback } from "react";
import { Button } from "../../../app/components/ui/button";
import { Card } from "../../../app/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "../../../app/components/ui/dialog";
import { ShieldCheck, Eye, Edit, Trash2, Plus, X, AlertCircle, Save, Menu } from "lucide-react";
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
  onSubmit: (data: {
    id: string;
    permissions: { moduleId: string; canRead: boolean; canWrite: boolean; canUpdate: boolean; canDelete: boolean }[];
  }) => Promise<void>;
}

const PermissionEditor: React.FC<PermissionEditorProps> = ({
  isOpen,
  onClose,
  role,
  modules,
  onSubmit,
}) => {
  const queryClient = useQueryClient();
  const [allPermissions, setAllPermissions] = useState<{ [m: string]: PermissionData }>({});
  const [originalPermissions, setOriginalPermissions] = useState<{ [m: string]: PermissionData }>({});
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [modifiedModules, setModifiedModules] = useState<Set<string>>(new Set());
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [permissionsError, setPermissionsError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data: existingPermissions, isLoading: hookIsLoading, error: hookError } =
    useFetchPermissionsByRole(role?.id || null);

  const loadRolePermissions = useCallback(async () => {
    if (!role?.id || !isOpen || modules.length === 0) return;
    setIsLoadingPermissions(true);
    setPermissionsError(null);

    const init: { [m: string]: PermissionData } = {};
    modules.forEach((mod) => {
      init[mod.id] = { canRead: false, canWrite: false, canUpdate: false, canDelete: false };
    });
    if (existingPermissions && Array.isArray(existingPermissions)) {
      existingPermissions.forEach((perm: ExistingPermission) => {
        if (init[perm.moduleId]) {
          init[perm.moduleId] = {
            canRead: perm.canRead,
            canWrite: perm.canWrite,
            canUpdate: perm.canUpdate,
            canDelete: perm.canDelete,
          };
        }
      });
    }
    setAllPermissions(init);
    setOriginalPermissions(JSON.parse(JSON.stringify(init)));
    setModifiedModules(new Set());
    setIsLoadingPermissions(false);
  }, [role?.id, isOpen, modules, existingPermissions]);

  useEffect(() => {
    if (isOpen && role && !hookIsLoading) loadRolePermissions();
  }, [isOpen, role, hookIsLoading, loadRolePermissions]);

  const updatePermission = (moduleId: string, type: keyof PermissionData, value: boolean) => {
    const updated = {
      ...allPermissions,
      [moduleId]: { ...allPermissions[moduleId], [type]: value },
    };
    setAllPermissions(updated);

    const orig = originalPermissions[moduleId];
    const curr = updated[moduleId];
    const changed =
      orig.canRead !== curr.canRead ||
      orig.canWrite !== curr.canWrite ||
      orig.canUpdate !== curr.canUpdate ||
      orig.canDelete !== curr.canDelete;

    setModifiedModules((s) => {
      const copy = new Set(s);
      changed ? copy.add(moduleId) : copy.delete(moduleId);
      return copy;
    });
  };

  const saveChanges = async () => {
    if (!role?.id || modifiedModules.size === 0) return;
    const payload = modules.map((mod) => ({
      moduleId: mod.id,
      ...allPermissions[mod.id],
    }));
    await onSubmit({ id: role.id, permissions: payload });
    queryClient.invalidateQueries({ queryKey: ["permissions", "role", role.id] });
    setOriginalPermissions(JSON.parse(JSON.stringify(allPermissions)));
    setModifiedModules(new Set());
  };

  const handleClose = () => {
    if (role?.id) queryClient.invalidateQueries({ queryKey: ["permissions", "role", role.id] });
    onClose();
  };

  if (!isOpen || !role) return null;
  const isLoading = isLoadingPermissions || hookIsLoading;
  const hasError = permissionsError || hookError;

  const toggleAll = (moduleId: string, value: boolean) => {
    // actualiza allPermissions
    setAllPermissions(prev => {
      const updated = {
        ...prev,
        [moduleId]: {
          canRead: value,
          canWrite: value,
          canUpdate: value,
          canDelete: value,
        },
      };
      return updated;
    });
    // marca como modificado
    setModifiedModules(m =>
      new Set(m).add(moduleId)
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="w-full max-w-[95%] sm:max-w-[1000px] h-[90vh] flex flex-col p-0">
        <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 flex justify-between items-center rounded-t-xl">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-6 w-6 text-white" />
            </Button>
            <ShieldCheck className="h-6 w-6 text-white" />
            <DialogTitle className="text-white text-xl">Permisos - {role.name}</DialogTitle>
          </div>
          {modifiedModules.size > 0 && (
            <div className="bg-white/20 px-3 py-1 rounded-full text-white text-sm">
              {modifiedModules.size} cambio{modifiedModules.size > 1 ? "s" : ""} pendiente
            </div>
          )}
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div
            className={`${
              isSidebarOpen ? "fixed inset-0 z-50 bg-white flex" : "hidden md:flex"
            } w-full md:w-80 border-r flex-col p-2 bg-gray-50`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold px-2">Módulos</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                <X />
              </Button>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center flex-1">
                <div className="animate-spin h-6 w-6 border-b-2 border-green-600 rounded-full" />
              </div>
            ) : hasError ? (
              <div className="text-red-600 p-4 text-center">Error cargando permisos</div>
            ) : (
              modules.map((mod) => {
                const isSel = mod.id === selectedModule;
                const hasPerm = Object.values(allPermissions[mod.id] || {}).some((v) => v);
                return (
                  <Card
                    key={mod.id}
                    className={`mb-2 p-3 cursor-pointer ${
                      isSel ? "border-green-500 bg-green-50" : "border-gray-200"
                    }`}
                    onClick={() => {
                      setSelectedModule(mod.id);
                      setIsSidebarOpen(false);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className={isSel ? "text-green-800" : "text-gray-800"}>{mod.name}</h4>
                      </div>
                      <div className="flex space-x-1">
                        {hasPerm && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                        {modifiedModules.has(mod.id) && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>

          {/* Main */}
          <div className="flex-1 flex flex-col">
            {selectedModule && allPermissions[selectedModule] && (
              <>
                <div className="p-4 border-b flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{modules.find((m) => m.id === selectedModule)?.name}</h3>
                    <p className="text-sm text-gray-600">Ajusta permisos y guarda</p>
                  </div>
                  {modifiedModules.has(selectedModule) && <span className="text-blue-600">● Modificado</span>}
                </div>

                {/* Global switch */}
                <div className="p-4 border-b bg-gray-100 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Activar/Desactivar todos</h4>
                    <p className="text-sm text-gray-600">Todos los permisos módulo</p>
                  </div>
                 {/* Switch global */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={
                        Object.values(allPermissions[selectedModule]).every(v => v)
                      }
                      onChange={(e) => {
                        toggleAll(selectedModule, e.target.checked);
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:bg-white after:rounded-full after:transition-all" />
                  </label>
                </div>

                {/* Individual switches */}
                <div className="p-6 overflow-y-auto flex-1">
                  <div className="grid gap-6 max-w-2xl">
                    {[
                      { label: "Leer / Consultar", key: "canRead", icon: <Eye className="h-6 w-6 text-blue-500" /> },
                      { label: "Crear / Escribir", key: "canWrite", icon: <Plus className="h-6 w-6 text-green-500" /> },
                      { label: "Actualizar / Editar", key: "canUpdate", icon: <Edit className="h-6 w-6 text-purple-500" /> },
                      { label: "Eliminar", key: "canDelete", icon: <Trash2 className="h-6 w-6 text-red-500" /> },
                    ].map(({ label, key, icon }) => (
                      <div key={key} className="flex justify-between items-center p-4 border rounded-lg bg-white">
                        <div className="flex items-center space-x-3">
                          {icon}
                          <div>
                            <h4 className="font-medium">{label}</h4>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={allPermissions[selectedModule][key as keyof PermissionData]}
                            onChange={(e) => updatePermission(selectedModule, key as keyof PermissionData, e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-checked:bg-blue-600 rounded-full peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:bg-white after:rounded-full after:transition-all" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* no selection */}
            {!selectedModule && (
              <div className="flex-1 flex items-center justify-center">
                <ShieldCheck className="h-12 w-12 text-gray-300" />
                <p className="ml-2 text-gray-500">
                  {isLoading ? "Cargando permisos..." : "Selecciona un módulo"}
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-2 border-t p-4 bg-gray-50">
          <Button variant="outline" onClick={handleClose}>
            <X className="mr-1 h-4 w-4" /> Cerrar
          </Button>
          {modifiedModules.size > 0 && (
            <Button variant="outline" onClick={() => loadRolePermissions()}>
              Deshacer {modifiedModules.size} cambio{modifiedModules.size > 1 ? "s" : ""}
            </Button>
          )}
          <Button onClick={saveChanges} disabled={modifiedModules.size === 0}>
            <Save className="mr-1 h-4 w-4" /> Guardar {modifiedModules.size} cambio
            {modifiedModules.size > 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionEditor;
