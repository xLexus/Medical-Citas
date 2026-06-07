import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MedicalHistory } from '../models/medical-history.model';

@Injectable({
  providedIn: 'root'
})
export class MedicalHistoryService {
  private historiesSubject: BehaviorSubject<MedicalHistory[]>;
  public histories: Observable<MedicalHistory[]>;

  constructor() {
    const storedHistories = localStorage.getItem('medicalHistories');
    const initialHistories = storedHistories ? JSON.parse(storedHistories) : this.getInitialHistories();

    this.historiesSubject = new BehaviorSubject<MedicalHistory[]>(initialHistories);
    this.histories = this.historiesSubject.asObservable();

    if (!storedHistories) {
      this.saveToStorage(initialHistories);
    }
  }

  private getInitialHistories(): MedicalHistory[] {
    return [
      {
        id: '1',
        pacienteId: '1',
        medicoId: '2',
        fechaConsulta: new Date('2024-06-15'),
        diagnostico: 'Hipertensión arterial grado 1',
        tratamiento: 'Enalapril 10mg cada 12 horas',
        observaciones: 'Control en 30 días. Dieta baja en sodio.',
        nombreMedico: 'Dr. Juan Ponluisa'
      },
      {
        id: '2',
        pacienteId: '1',
        medicoId: '2',
        fechaConsulta: new Date('2024-08-20'),
        diagnostico: 'Control hipertensión',
        tratamiento: 'Continuar con Enalapril 10mg',
        observaciones: 'Presión arterial controlada. Paciente cumple tratamiento.',
        nombreMedico: 'Dr. Juan Ponluisa'
      },
      {
        id: '3',
        pacienteId: '2',
        medicoId: '2',
        fechaConsulta: new Date('2024-07-10'),
        diagnostico: 'Diabetes Mellitus tipo 2',
        tratamiento: 'Metformina 850mg cada 12 horas',
        observaciones: 'Glucosa en ayunas 145 mg/dl. Iniciar control nutricional.',
        nombreMedico: 'Dr. Juan Ponluisa'
      }
    ];
  }

  private saveToStorage(histories: MedicalHistory[]): void {
    localStorage.setItem('medicalHistories', JSON.stringify(histories));
  }

  getAllHistories(): MedicalHistory[] {
    return this.historiesSubject.value;
  }

  getHistoriesByPatientId(patientId: string): MedicalHistory[] {
    return this.historiesSubject.value.filter(h => h.pacienteId === patientId);
  }

  getHistoryById(id: string): MedicalHistory | undefined {
    return this.historiesSubject.value.find(h => h.id === id);
  }

  addHistory(history: Omit<MedicalHistory, 'id'>): MedicalHistory {
    const newHistory: MedicalHistory = {
      ...history,
      id: Date.now().toString()
    };

    const currentHistories = this.historiesSubject.value;
    const updatedHistories = [...currentHistories, newHistory];

    this.historiesSubject.next(updatedHistories);
    this.saveToStorage(updatedHistories);

    return newHistory;
  }

  updateHistory(id: string, history: Partial<MedicalHistory>): boolean {
    const currentHistories = this.historiesSubject.value;
    const index = currentHistories.findIndex(h => h.id === id);

    if (index !== -1) {
      currentHistories[index] = { ...currentHistories[index], ...history };
      this.historiesSubject.next([...currentHistories]);
      this.saveToStorage(currentHistories);
      return true;
    }

    return false;
  }

  deleteHistory(id: string): boolean {
    const currentHistories = this.historiesSubject.value;
    const filteredHistories = currentHistories.filter(h => h.id !== id);

    if (filteredHistories.length < currentHistories.length) {
      this.historiesSubject.next(filteredHistories);
      this.saveToStorage(filteredHistories);
      return true;
    }

    return false;
  }
}