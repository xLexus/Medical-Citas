import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../core/services/patient';
import { MedicalHistoryService } from '../../core/services/medical-history';
import { Patient } from '../../core/models/patient.model';
import { MedicalHistory } from '../../core/models/medical-history.model';

@Component({
  selector: 'ponluisa-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss'],
  standalone: false
})
export class PatientDetailComponent implements OnInit {
  patient: Patient | undefined;
  medicalHistories: MedicalHistory[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private medicalHistoryService: MedicalHistoryService
  ) { }

  ngOnInit() {
    const patientId = this.route.snapshot.paramMap.get('id');
    if (patientId) {
      this.loadPatient(patientId);
      this.loadMedicalHistories(patientId);
    }
  }

  loadPatient(id: string) {
    this.patient = this.patientService.getPatientById(id);
  }

  loadMedicalHistories(patientId: string) {
    this.medicalHistories = this.medicalHistoryService
      .getHistoriesByPatientId(patientId)
      .sort((a, b) => new Date(b.fechaConsulta).getTime() - new Date(a.fechaConsulta).getTime());
  }

  editPatient() {
    if (this.patient) {
      this.router.navigate(['/patient/form', this.patient.id]);
    }
  }

  viewAllHistories() {
    if (this.patient) {
      this.router.navigate(['/medical-history/patient', this.patient.id]);
    }
  }

  addHistory() {
    if (this.patient) {
      this.router.navigate(['/medical-history/form'], {
        queryParams: { patientId: this.patient.id }
      });
    }
  }

  getGenderIcon(): string {
    if (!this.patient) return 'person';

    switch (this.patient.genero) {
      case 'Masculino': return 'male';
      case 'Femenino': return 'female';
      default: return 'transgender';
    }
  }

  getGenderColor(): string {
    if (!this.patient) return 'medium';

    switch (this.patient.genero) {
      case 'Masculino': return 'primary';
      case 'Femenino': return 'secondary';
      default: return 'tertiary';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}