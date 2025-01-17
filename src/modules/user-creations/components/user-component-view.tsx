"use client";
import React, { useState } from 'react';
import { useFetchUsers } from '@/modules/user-creations/hook/useUsers';
import { Card, CardContent, CardHeader, CardTitle } from '../../../app/components/ui/card';
import { UserIcon } from 'lucide-react';
import UserModal from './modal-update-user'; // Asegúrate de que la ruta sea correcta
import UserDetail from './profile-component-view'; // Asegúrate de que la ruta sea correcta
import { User } from '@/modules/user-creations/types/user';

const UserList: React.FC = () => {
  const { data: users, isLoading, error } = useFetchUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewingProfile, setViewingProfile] = useState(false);

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
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users && users.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow duration-300" onClick={() => handleProfileClick(user)}>
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedUser && (
        <UserModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          user={selectedUser}
        />
      )}
    </div>
  );
};

export default UserList;