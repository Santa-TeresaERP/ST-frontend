
import { UserWithPermissions } from '@/core/utils/permission-types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserWithPermissions;
}