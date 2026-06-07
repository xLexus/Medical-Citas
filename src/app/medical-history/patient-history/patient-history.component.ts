import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalHistoryService } from '../../core/services/medical-history';
import { PatientService } from '../../core/services/patient';
import { Patient } from '../../core/models/patient.model';
import { MedicalHistory } from '../../core/models/medical-history.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'ponluisa-patient-history',
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.scss'],
  standalone: false,
})
export class PatientHistoryComponent implements OnInit {
  patient: Patient | undefined;
  histories: MedicalHistory[] = [];
  filteredHistories: MedicalHistory[] = [];
  searchTerm: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private medicalHistoryService: MedicalHistoryService,
    private patientService: PatientService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    const patientId = this.route.snapshot.paramMap.get('patientId');
    if (patientId) {
      this.loadPatient(patientId);
      this.loadHistories(patientId);
    }
  }

  loadPatient(id: string) {
    this.patient = this.patientService.getPatientById(id);
  }

  loadHistories(patientId: string) {
    this.histories = this.medicalHistoryService
      .getHistoriesByPatientId(patientId)
      .sort((a, b) => new Date(b.fechaConsulta).getTime() - new Date(a.fechaConsulta).getTime());

    this.filteredHistories = [...this.histories];
  }

  searchHistories(event: any) {
    this.searchTerm = event.target.value.toLowerCase();

    if (!this.searchTerm) {
      this.filteredHistories = [...this.histories];
      return;
    }

    this.filteredHistories = this.histories.filter(history =>
      history.diagnostico.toLowerCase().includes(this.searchTerm) ||
      history.tratamiento.toLowerCase().includes(this.searchTerm) ||
      (history.nombreMedico && history.nombreMedico.toLowerCase().includes(this.searchTerm))
    );
  }

  addHistory() {
    if (this.patient) {
      this.router.navigate(['/medical-history/form'], {
        queryParams: { patientId: this.patient.id }
      });
    }
  }

  viewPatientDetail() {
    if (this.patient) {
      this.router.navigate(['/patient/detail', this.patient.id]);
    }
  }

  async confirmDelete(history: MedicalHistory, event: Event) {
    event.stopPropagation();

    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Está seguro de eliminar esta historia clínica?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.deleteHistory(history.id);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteHistory(id: string) {
    const success = this.medicalHistoryService.deleteHistory(id);

    if (success && this.patient) {
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Historia clínica eliminada correctamente',
        buttons: ['OK']
      });
      await alert.present();
      this.loadHistories(this.patient.id);
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatShortDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}