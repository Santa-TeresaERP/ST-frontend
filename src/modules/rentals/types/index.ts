export interface Location {
  id?: string; // ✅ Añadir ID opcional
  nombre: string;
  direccion: string;
  capacidad: string;
  estado: string;
}

// Place type is now defined in places.d.ts

export interface Rental {
  id: number;
  comprador: string;
  lugar: string;
  vendedor: string;
  fechaInicio: string;
  fechaTermino: string;
  monto: number;
  acciones: string;
}

export interface BuyerDetails {
  nombreCompleto: string;
  dni: string;
  numeroCelular: string;
  correoElectronico: string;
}

// Export customer types
export * from './customer';
