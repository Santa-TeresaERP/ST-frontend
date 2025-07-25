export interface Location {
  nombre: string;
  direccion: string;
  capacidad: string;
  estado: string;
}

export interface Place {
  id: number;
  nombre: string;
  area: string;
  tipo: string;
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
