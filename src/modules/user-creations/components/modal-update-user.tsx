"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../app/components/ui/dialog";
import { Button } from "../../../app/components/ui/button";
import { Input } from "../../../app/components/ui/input";
import { Label } from "../../../app/components/ui/label";
import { User } from "@/modules/user-creations/types/user";
import { useUpdateUser } from "@/modules/user-creations/hook/useUsers";
import { useFetchRoles } from "@/modules/roles/hook/useRoles";
import { useModulePermissions } from '@/core/utils/permission-hooks';
import { MODULE_IDS } from '@/core/utils/permission-types';
import { z } from "zod";
import { Save, UserCog } from "lucide-react";
import AccessDeniedModal from '@/core/utils/AccessDeniedModal';

const userSchema = z.object({
  name: z
    .string()
    .max(45, "El nombre completo no debe exceder los 45 caracteres")
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "El nombre solo debe contener letras y espacios"),
  dni: z
    .string()
    .length(8, "El DNI debe tener 8 dígitos")
    .regex(/^[0-9]+$/, "El DNI solo debe contener números"),
  phonenumber: z
    .string()
    .length(9, "El número telefónico debe tener 9 dígitos")
    .regex(/^[0-9]+$/, "El número telefónico solo debe contener números"),
  email: z.string().email("El email debe tener un formato válido"),
  roleId: z.string().min(1, "Debe seleccionar un rol"),
});

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
};

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user }) => {
  const [formData, setFormData] = useState<Partial<User>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showWarning, setShowWarning] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const { mutateAsync: updateUser } = useUpdateUser();
  const { data: roles, error: errorRoles, isLoading: isLoadingRoles } = useFetchRoles();
  const { canView: canViewRoles } = useModulePermissions(MODULE_IDS.ROLES);

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validateForm = () => {
    try {
      userSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowWarning(true);
    }
  };

  const handleConfirmSubmit = async () => {
    if (user?.id) {
      try {
        const payload = {
          name: formData.name || "",
          dni: formData.dni || "",
          phonenumber: formData.phonenumber?.toString() || "",
          email: formData.email || "",
          roleId: formData.roleId || "",
        };
        await updateUser({ id: user.id.toString(), payload });
        setShowWarning(false);
        onClose();
      } catch (error: unknown) {
        // Si es error de permisos, mostrar modal de acceso denegado sin loggear
        const errorObj = error as { isPermissionError?: boolean; silent?: boolean; message?: string };
        if (errorObj?.isPermissionError && errorObj?.silent) {
          setShowAccessDenied(true);
          setShowWarning(false);
        } else {
          console.error("Error updating user:", error);
        }
      }
    }
  };

  // Si hay error al cargar roles, mostrar mensaje apropiado
  if (errorRoles) {
    const isPermissionError = !roles && errorRoles;
    
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[600px] h-[40vh] flex items-center justify-center p-0 rounded-2xl shadow-xl">
          <div className="text-center p-6">
            <div className="bg-orange-100 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
              <UserCog className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-lg font-semibold text-gray-800 mb-2">
              {isPermissionError ? "Sin Permisos para Ver Roles" : "Error al Cargar Datos"}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              {isPermissionError 
                ? "No tienes permisos para ver la lista de roles. No se puede editar el usuario sin acceso a los roles disponibles." 
                : "Por favor, intente de nuevo más tarde."
              }
            </p>
            <Button 
              onClick={onClose}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Si está cargando roles, mostrar indicador
  if (isLoadingRoles) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[600px] h-[30vh] flex items-center justify-center p-0 rounded-2xl shadow-xl">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <span className="mt-4 text-lg text-gray-700">Cargando roles...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[600px] p-0 overflow-hidden rounded-2xl shadow-xl">
        <div className="w-full bg-gradient-to-r from-green-600 to-green-700 py-6 px-6">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-white flex items-center justify-center gap-3">
              <UserCog className="w-10 h-10 text-white" />
              Editar Usuario
            </DialogTitle>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label htmlFor="name" className="uppercase font-semibold text-sm text-gray-700">
                Nombre
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name || ""}
                onChange={handleInputChange}
                className={`border border-black rounded-md px-4 py-2 ${
                  errors.name ? "border-red-600" : ""
                }`}
              />
              {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="uppercase font-semibold text-sm text-gray-700">
                Correo Electrónico
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                className={`border border-black rounded-md px-4 py-2 ${
                  errors.email ? "border-red-600" : ""
                }`}
              />
              {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="phonenumber" className="uppercase font-semibold text-sm text-gray-700">
                Teléfono
              </Label>
              <Input
                id="phonenumber"
                name="phonenumber"
                type="text"
                value={formData.phonenumber || ""}
                onChange={handleInputChange}
                className={`border border-black rounded-md px-4 py-2 ${
                  errors.phonenumber ? "border-red-600" : ""
                }`}
              />
              {errors.phonenumber && (
                <p className="text-red-600 text-sm">{errors.phonenumber}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="dni" className="uppercase font-semibold text-sm text-gray-700">
                DNI
              </Label>
              <Input
                id="dni"
                name="dni"
                type="text"
                value={formData.dni || ""}
                onChange={handleInputChange}
                className={`border border-black rounded-md px-4 py-2 ${
                  errors.dni ? "border-red-600" : ""
                }`}
              />
              {errors.dni && <p className="text-red-600 text-sm">{errors.dni}</p>}
            </div>

            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="roleId" className="uppercase font-semibold text-sm text-gray-700">
                Rol
              </Label>
              <select
                id="roleId"
                name="roleId"
                value={formData.roleId || ""}
                onChange={handleInputChange}
                disabled={!canViewRoles}
                className={`w-full px-4 py-2 border rounded-md text-sm bg-white focus:outline-none ${
                  errors.roleId ? "border-red-600" : "border-black"
                } ${!canViewRoles ? "bg-gray-100 cursor-not-allowed" : ""}`}
              >
                {!canViewRoles ? (
                  <option value="">🔒 Sin permisos para ver roles</option>
                ) : isLoadingRoles ? (
                  <option value="">Cargando roles...</option>
                ) : (
                  <>
                    <option value="">Seleccione un rol</option>
                    {roles?.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
              {errors.roleId && <p className="text-red-600 text-sm">{errors.roleId}</p>}
              {!canViewRoles && (
                <p className="text-orange-600 text-sm">
                  ⚠️ Necesitas permisos para ver roles. Contacta al administrador.
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border border-gray-400 hover:bg-gray-100 text-gray-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-500 text-white w-full sm:w-auto flex items-center gap-2"
            >
              <Save size={18} />
              Guardar
            </Button>
          </DialogFooter>
        </form>

        {showWarning && (
          <Dialog open={showWarning} onOpenChange={() => setShowWarning(false)}>
            <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[600px] p-0 overflow-hidden rounded-2xl shadow-xl">
              <div className="w-full bg-gradient-to-r from-red-600 to-red-700 py-4 px-6">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold text-white text-center">
                    Confirmar Cambios
                  </DialogTitle>
                </DialogHeader>
              </div>
              <div className="text-center py-6 px-6">
                <p className="text-gray-700 mb-4">¿Estás seguro de que quieres guardar los cambios?</p>
                <div className="flex justify-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowWarning(false)}
                    className="text-gray-700 border-gray-400 hover:bg-gray-100"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    onClick={handleConfirmSubmit}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Confirmar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>

    {/* Modal de acceso denegado */}
    <AccessDeniedModal
      isOpen={showAccessDenied}
      onClose={() => setShowAccessDenied(false)}
      title="Permisos Insuficientes"
      message="No tienes permisos para editar usuarios del sistema."
      action="editar usuarios (permisos revocados)"
      module="Gestión de Usuarios"
    />
  </>
  );
};

export default UserModal;
