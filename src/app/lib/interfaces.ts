export interface User {
  id: string;
  name: string;
  dni: string;
  phonenumber: string;
  email: string;
  roleId: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
  status: boolean;
}