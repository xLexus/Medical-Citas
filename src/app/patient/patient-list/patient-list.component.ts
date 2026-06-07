import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from '../../core/services/patient';
import { Patient } from '../../core/models/patient.model';
import { AlertController, ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'ponluisa-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss'],
  standalone: false
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchTerm: string = '';

  constructor(
    private patientService: PatientService,
    private router: Router,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    this.loadPatients();
  }

  ionViewWillEnter() {
    this.loadPatients();
  }

  loadPatients() {
    this.patients = this.patientService.getAllPatients();
    this.filteredPatients = [...this.patients];
  }

  searchPatients(event: any) {
    this.searchTerm = event.target.value.toLowerCase();

    if (!this.searchTerm) {
      this.filteredPatients = [...this.patients];
      return;
    }

    this.filteredPatients = this.patients.filter(patient =>
      patient.nombreCompleto.toLowerCase().includes(this.searchTerm) ||
      patient.tipoSangre.toLowerCase().includes(this.searchTerm)
    );
  }

  viewPatient(patient: Patient) {
    this.router.navigate(['/patient/detail', patient.id]);
  }

  addPatient() {
    this.router.navigate(['/patient/form']);
  }

  async presentActionSheet(patient: Patient, event: Event) {
    event.stopPropagation();

    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Ver Detalles',
          icon: 'eye',
          handler: () => {
            this.viewPatient(patient);
          }
        },
        {
          text: 'Ver Historial Médico',
          icon: 'medical',
          handler: () => {
            this.router.navigate(['/medical-history/patient', patient.id]);
          }
        },
        {
          text: 'Editar',
          icon: 'create',
          handler: () => {
            this.router.navigate(['/patient/form', patient.id]);
          }
        },
        {
          text: 'Eliminar',
          icon: 'trash',
          role: 'destructive',
          handler: () => {
            this.confirmDelete(patient);
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async confirmDelete(patient: Patient) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Está seguro de eliminar al paciente ${patient.nombreCompleto}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.deletePatient(patient.id);
          }
        }
      ]
    });

    await alert.present();
  }

  async deletePatient(id: string) {
    const success = this.patientService.deletePatient(id);

    if (success) {
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Paciente eliminado correctamente',
        buttons: ['OK']
      });
      await alert.present();
      this.loadPatients();
    }
  }

  getGenderIcon(genero: string): string {
    switch (genero) {
      case 'Masculino': return 'male';
      case 'Femenino': return 'female';
      default: return 'transgender';
    }
  }
}