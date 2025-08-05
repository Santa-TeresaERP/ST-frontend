export interface Location {
  id?: string; // ✅ Añadir ID opcional
  nombre: string;
  direccion: string;
  capacidad: string;
  estado: string;
}

export interface Place {
  id: string; // ✅ Backend devuelve UUID (string), no number
  nombre: string; // ✅ Transformado desde "name" del backend
  area: string;
  // ✅ Removido "tipo" porque no existe en el backend
  location_id?: string; // ✅ Opcional, viene del backend
  createdAt?: string; // ✅ Opcional, viene del backend
  updatedAt?: string; // ✅ Opcional, viene del backend
}

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
