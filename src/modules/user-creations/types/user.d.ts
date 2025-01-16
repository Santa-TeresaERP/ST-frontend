// src/modules/users/types/user.ts
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  dni: z.string(),
  phonenumber: z.string(),
  email: z.string(),
  roleId: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  status: z.boolean(),
});

export type User = z.infer<typeof UserSchema>;

export interface CreateUserPayload {
  name: string;
  dni: string;
  phonenumber: string;
  email: string;
  roleId: string;
  password: string;
  status: boolean;
}

export interface UpdateUserPayload {
  name: string;
  dni: string;
  phonenumber: string;
  email: string;
}
