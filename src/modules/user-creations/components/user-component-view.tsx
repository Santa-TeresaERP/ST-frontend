"use client";
import React, { useEffect, useState } from 'react';
import { User } from '@/app/lib/interfaces';
import Modal from './modal-create-user';
import UserModal from './modal-update-user';
import DeleteUserModal from './modal-delete-user';
import { Card, CardContent, CardHeader, CardTitle } from '../../../app/components/ui/card';
import { Button } from '../../../app/components/ui/button';
import { PlusCircle, User as UserIcon } from 'lucide-react';

const UserList: React.FC = () => {
  const { getUsers, deleteUser, updateUser, createUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [getUsers]); 

  useEffect(() => {
    if (selectedUser) {
      setUserModalOpen(true);
    }
  }, [selectedUser]);

  const handleCreateUser = async (userData: Omit<User, 'createdAt' | 'updatedAt'>) => {
    try {
      const newUser: User = await createUser(userData);
      newUser.modules = userData.modules;
      setUsers((prevUsers) => [...prevUsers, newUser]);
      setModalOpen(false);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter(user => user.id !== userId)); 
      setDeleteUserModalOpen(false); 
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleUpdateUser = async (userId: number, userData: Partial<User>) => {
    try {
      const updatedUser = await updateUser(userId, userData);
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? updatedUser : user)));
      setSelectedUser(null);
      setUserModalOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <Button onClick={() => setModalOpen(true)} className="bg-red-600 hover:bg-red-700">
          <PlusCircle className="mr-2 h-4 w-4" /> Crear Usuario
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow duration-300">
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
            </CardContent>
            <div className="flex justify-end mt-4">
              <Button onClick={() => { setSelectedUser(user); setUserModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 mr-2">
                Editar
              </Button>
              <Button onClick={() => { setSelectedUser(user); setDeleteUserModalOpen(true); }} className="bg-red-600 hover:bg-red-700">
                Eliminar
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateUser}
      />
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => { setSelectedUser(null); setUserModalOpen(false); }}
        user={selectedUser}
        onUpdate={handleUpdateUser}
      />
      <DeleteUserModal
        isOpen={deleteUserModalOpen}
        onClose={() => { setSelectedUser(null); setDeleteUserModalOpen(false); }}
        user={selectedUser}
        onDelete={handleDeleteUser}
      />
    </div>
  );
};

export default UserList;
