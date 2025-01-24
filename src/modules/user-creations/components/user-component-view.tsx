"use client";
import React, { useState } from 'react';
import { useFetchUsers, useCreateUser, useDeleteUser } from '@/modules/user-creations/hook/useUsers';
import { Card, CardContent, CardHeader, CardTitle } from '../../../app/components/ui/card';
import { UserIcon } from 'lucide-react';
import UserModal from './modal-update-user';
import UserDetail from './profile-component-view';
import Modal from './modal-create-user';
import DeleteUserModal from './modal-delete-user';
import { User } from '@/modules/user-creations/types/user';
import { Button } from '@/app/components/ui/button';

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <Button onClick={handleOpenCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white">
          Crear Usuario
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users &&
          users.map((user, index) => (
            <Card key={user.id || index} className="hover:shadow-lg transition-shadow duration-300" onClick={() => handleProfileClick(user)}>
              <CardHeader className="bg-red-50">
                <CardTitle className="flex items-center text-red-600">
                  <UserIcon className="mr-2 h-5 w-5" />
                  {user.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Teléfono:</strong> {user.phonenumber}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>DNI:</strong> {user.dni}
                </p>
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(user);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 ml-2 rounded hover:bg-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteUser(user); // Mostrar modal de confirmación
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
      {selectedUser && (
        <UserModal isOpen={isModalOpen} onClose={handleCloseModal} user={selectedUser} />
      )}
      
      <Modal isOpen={isCreateModalOpen} onClose={handleCloseCreateModal} onSubmit={handleCreateUser} />
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