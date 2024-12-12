
export type ModuleKeys = 'administrativo' | 'ventas' | 'alquileres';

export interface Modules {
  administrativo: {
    usersgroups: boolean;
  };
  ventas: {
    misa: boolean; 
    reposteria: boolean;
    manualidades: boolean; 
  };
  alquileres: {
    santaCatalina: boolean; 
    goyoneche: boolean; 
    santaMarta: boolean; 
  };
}

export interface User {
  id: number;
  name: string;
  phonenumber: string;
  dni: string;
  email: string;
  isadmin: boolean;
  modules: Modules; 
  createdAt?: string;
  updatedAt?: string;
}