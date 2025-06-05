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
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <UserIcon className="w-8 h-8 text-red-600" />
          Gestión de Usuarios
        </h1>
        <Button
          onClick={handleOpenCreateModal}
          className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm font-semibold"
        >
          <PlusCircle className="w-5 h-5" />
          Crear Usuario
        </Button>
      </div>
  
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {users?.map((user, index) => (
          <div
            key={user.id || index}
            onClick={() => handleProfileClick(user)}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 p-4 rounded-full shadow-inner mb-5">
                <UserIcon className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">{user.name}</h2>
              <div className="text-sm text-gray-700 space-y-1">
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Teléfono:</span> {user.phonenumber}</p>
                <p><span className="font-medium">DNI:</span> {user.dni}</p>
              </div>
              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(user);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm flex items-center gap-1"
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteUser(user);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm flex items-center gap-1"
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