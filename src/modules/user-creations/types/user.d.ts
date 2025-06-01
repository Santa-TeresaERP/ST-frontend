/* eslint-disable @typescript-eslint/no-empty-object-type */
import { userSchema } from '../schemas/userValidation';

export type User = z.infer<typeof userSchema>;

export interface CreateUserPayload extends Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'status'> {
  password: string;
}

export interface UpdateUserPayload extends Partial<Omit<User, 'id' | 'roleId' | 'password' | 'createdAt' | 'updatedAt' | 'status'>> {}

export interface ChangePasswordRequest {
  userId: string;
  currentPassword: string;
  newPassword: string;
}