import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MedicalHistoryService } from '../../core/services/medical-history';
import { PatientService } from '../../core/services/patient';
import { AuthService } from '../../core/services/auth';
import { MedicalHistory } from '../../core/models/medical-history.model';
import { Patient } from '../../core/models/patient.model';

@Component({
  selector: 'ponluisa-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss'],
  standalone: false
})
export class HistoryListComponent implements OnInit {
  histories: MedicalHistory[] = [];
  filteredHistories: MedicalHistory[] = [];
  searchTerm: string = '';
  patients: Map<string, Patient> = new Map();

  constructor(
    private medicalHistoryService: MedicalHistoryService,
    private patientService: PatientService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadData();
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    // Cargar pacientes en un Map para acceso rápido
    this.patientService.getAllPatients().forEach(patient => {
      this.patients.set(patient.id, patient);
    });

    // Cargar historias
    const currentUser = this.authService.currentUserValue;
    let allHistories = this.medicalHistoryService.getAllHistories();

    // Si es médico, solo mostrar sus historias
    if (currentUser?.rol === 'medico') {
      allHistories = allHistories.filter(h => h.medicoId === currentUser.id);
    }

    this.histories = allHistories.sort((a, b) =>
      new Date(b.fechaConsulta).getTime() - new Date(a.fechaConsulta).getTime()
    );

    this.filteredHistories = [...this.histories];
  }

  searchHistories(event: any) {
    this.searchTerm = event.target.value.toLowerCase();

    if (!this.searchTerm) {
      this.filteredHistories = [...this.histories];
      return;
    }

    this.filteredHistories = this.histories.filter(history => {
      const patient = this.patients.get(history.pacienteId);
      const patientName = patient?.nombreCompleto.toLowerCase() || '';

      return (
        history.diagnostico.toLowerCase().includes(this.searchTerm) ||
        history.tratamiento.toLowerCase().includes(this.searchTerm) ||
        patientName.includes(this.searchTerm) ||
        (history.nombreMedico && history.nombreMedico.toLowerCase().includes(this.searchTerm))
      );
    });
  }

  getPatientName(patientId: string): string {
    return this.patients.get(patientId)?.nombreCompleto || 'Desconocido';
  }

  viewPatientHistory(history: MedicalHistory) {
    this.router.navigate(['/medical-history/patient', history.pacienteId]);
  }

  addHistory() {
    this.router.navigate(['/medical-history/form']);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}