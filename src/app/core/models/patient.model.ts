export interface Patient {
  id: string;
  nombreCompleto: string;
  edad: number;
  genero: 'Masculino' | 'Femenino' | 'Otro';
  tipoSangre: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  telefono?: string;
  direccion?: string;
  historialBasico?: string;
  fechaRegistro: Date;
}