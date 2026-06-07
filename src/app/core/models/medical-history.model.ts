export interface MedicalHistory {
  id: string;
  pacienteId: string;
  medicoId: string;
  fechaConsulta: Date;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
  nombreMedico?: string;
}