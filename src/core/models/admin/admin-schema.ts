import { z } from 'zod';

export const ModuleKeysSchema = z.enum(['administrativo', 'ventas', 'alquileres']);

export const ModulesSchema = z.object({
  administrativo: z.object({
    usersgroups: z.boolean()
  }),
  ventas: z.object({
    misa: z.boolean(),
    reposteria: z.boolean(),
    manualidades: z.boolean()
  }),
  alquileres: z.object({
    santaCatalina: z.boolean(),
    goyoneche: z.boolean(),
    santaMarta: z.boolean()
  })
});

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  phonenumber: z.string(),
  dni: z.string(),
  email: z.string(),
  isadmin: z.boolean(),
  modules: ModulesSchema,
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type ModuleKeys = z.infer<typeof ModuleKeysSchema>;
export type Modules = z.infer<typeof ModulesSchema>;
export type User = z.infer<typeof UserSchema>;
