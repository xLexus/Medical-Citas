export interface User {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rol: 'medico' | 'administrador';
  especialidad?: string;
  registroMedico?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  rol: 'medico' | 'administrador';
  especialidad?: string;
  registroMedico?: string;
}