import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Patient } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private patientsSubject: BehaviorSubject<Patient[]>;
  public patients: Observable<Patient[]>;

  constructor() {
    const storedPatients = localStorage.getItem('patients');
    const initialPatients = storedPatients ? JSON.parse(storedPatients) : this.getInitialPatients();

    this.patientsSubject = new BehaviorSubject<Patient[]>(initialPatients);
    this.patients = this.patientsSubject.asObservable();

    if (!storedPatients) {
      this.saveToStorage(initialPatients);
    }
  }

  private getInitialPatients(): Patient[] {
    return [
      {
        id: '1',
        nombreCompleto: 'María González',
        edad: 35,
        genero: 'Femenino',
        tipoSangre: 'O+',
        telefono: '0987654321',
        direccion: 'Av. Principal 123, Ambato',
        historialBasico: 'Hipertensión controlada',
        fechaRegistro: new Date('2024-01-15')
      },
      {
        id: '2',
        nombreCompleto: 'Carlos Pérez',
        edad: 42,
        genero: 'Masculino',
        tipoSangre: 'A+',
        telefono: '0998765432',
        direccion: 'Calle Secundaria 456, Ambato',
        historialBasico: 'Diabetes tipo 2',
        fechaRegistro: new Date('2024-02-20')
      },
      {
        id: '3',
        nombreCompleto: 'Ana Rodríguez',
        edad: 28,
        genero: 'Femenino',
        tipoSangre: 'B+',
        telefono: '0976543210',
        direccion: 'Barrio Central 789, Ambato',
        historialBasico: 'Sin antecedentes relevantes',
        fechaRegistro: new Date('2024-03-10')
      }
    ];
  }

  private saveToStorage(patients: Patient[]): void {
    localStorage.setItem('patients', JSON.stringify(patients));
  }

  getAllPatients(): Patient[] {
    return this.patientsSubject.value;
  }

  getPatientById(id: string): Patient | undefined {
    return this.patientsSubject.value.find(p => p.id === id);
  }

  addPatient(patient: Omit<Patient, 'id' | 'fechaRegistro'>): Patient {
    const newPatient: Patient = {
      ...patient,
      id: Date.now().toString(),
      fechaRegistro: new Date()
    };

    const currentPatients = this.patientsSubject.value;
    const updatedPatients = [...currentPatients, newPatient];

    this.patientsSubject.next(updatedPatients);
    this.saveToStorage(updatedPatients);

    return newPatient;
  }

  updatePatient(id: string, patient: Partial<Patient>): boolean {
    const currentPatients = this.patientsSubject.value;
    const index = currentPatients.findIndex(p => p.id === id);

    if (index !== -1) {
      currentPatients[index] = { ...currentPatients[index], ...patient };
      this.patientsSubject.next([...currentPatients]);
      this.saveToStorage(currentPatients);
      return true;
    }

    return false;
  }

  deletePatient(id: string): boolean {
    const currentPatients = this.patientsSubject.value;
    const filteredPatients = currentPatients.filter(p => p.id !== id);

    if (filteredPatients.length < currentPatients.length) {
      this.patientsSubject.next(filteredPatients);
      this.saveToStorage(filteredPatients);
      return true;
    }

    return false;
  }
}