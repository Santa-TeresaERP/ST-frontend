"use client";
import React, { useState } from 'react';
import { useFetchUsers, useCreateUser, useDeleteUser } from '@/modules/user-creations/hook/useUsers';
import UserModal from './modal-update-user';
import UserDetail from './profile-component-view';
import Modal from './modal-create-user';
import DeleteUserModal from './modal-delete-user';
import { User } from '@/modules/user-creations/types/user';
import { Button } from '@/app/components/ui/button';
import { UserIcon, Pencil, Trash2, PlusCircle } from 'lucide-react';

const UserList: React.FC = () => {
  const { data: users, isLoading, error } = useFetchUsers();
  const createUserMutation = useCreateUser();
  const deleteUserMutation = useDeleteUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewingProfile, setViewingProfile] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleEditClick = (user: User) => {
    console.log('Edit button clicked for user:', user);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleProfileClick = (user: User) => {
    console.log('Profile button clicked for user:', user);
    setSelectedUser(user);
    setViewingProfile(true);
  };

  const handleCloseModal = () => {
    console.log('Modal closed');
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleCloseProfile = () => {
    console.log('Profile closed');
    setViewingProfile(false);
    setSelectedUser(null);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateUser = async (data: Omit<User, 'createdAt' | 'updatedAt'> & { password: string }) => {
    try {
      console.log('Nuevo usuario creado:', data);
      await createUserMutation.mutateAsync(data);
      handleCloseCreateModal();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = async (userId: string) => {
    try {
      console.log('Eliminando usuario con ID:', userId);
      await deleteUserMutation.mutateAsync(userId);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (isLoading) {
    console.log('Loading users...');
    return <div>Loading...</div>;
  }

  if (error) {
    console.error('Error fetching users:', error);
    return <div>{error.message}</div>;
  }

  console.log('Users fetched:', users);

  if (viewingProfile && selectedUser) {
    return <UserDetail userId={selectedUser.id} onClose={handleCloseProfile} />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Título + Botón */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 px-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <UserIcon className="w-7 h-7 sm:w-8 sm:h-8 text-red-600" />
          Gestión de Usuarios
        </h1>
        <div className="flex justify-center sm:justify-end w-full sm:w-auto">
          <Button
            onClick={handleOpenCreateModal}
            className="bg-red-600 hover:bg-red-500 text-white shadow-md flex items-center px-4 py-2 rounded-3xl"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Crear Usuario
          </Button>
        </div>
      </div>

      {/* Cards */}
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {users?.map((user, index) => (
          <div
            key={user.id || index}
            onClick={() => handleProfileClick(user)}
            className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Barra superior roja */}
            <div className="h-2 w-full bg-gradient-to-r from-red-500 to-red-700" />

            <div className="flex flex-col items-center text-center p-5">
              {/* Icono */}
              <div className="bg-red-100 p-4 rounded-full shadow-inner mb-4">
                <UserIcon className="h-7 w-7 sm:h-8 sm:w-8 text-red-600" />
              </div>

              {/* Nombre */}
              <h2 className="text-lg font-semibold text-gray-800 mb-3">{user.name}</h2>

              {/* Info */}
              <div className="text-sm text-gray-700 space-y-1">
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Teléfono:</span> {user.phonenumber}</p>
                <p><span className="font-medium">DNI:</span> {user.dni}</p>
              </div>

              {/* Botones alineados horizontalmente */}
              <div className="flex sm:flex-row justify-center gap-2 mt-5 w-full">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(user);
                  }}
                  className="bg-white hover:bg-green-200 text-gray-800 border border-green-600 text-green-600 px-4 py-2 rounded-3xl text-sm font-medium shadow-sm flex items-center justify-center gap-1 w-full sm:w-auto"
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteUser(user);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-3xl text-sm font-medium shadow-sm flex items-center justify-center gap-1 w-full sm:w-auto"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modales */}
      {selectedUser && (
        <UserModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          user={selectedUser}
        />
      )}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateUser}
      />
      {userToDelete && (
        <DeleteUserModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          user={userToDelete}
          onDelete={confirmDeleteUser}
        />
      )}
    </div>
  );
};

export default UserList;