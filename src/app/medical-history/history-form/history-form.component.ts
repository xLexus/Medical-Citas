import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalHistoryService } from '../../core/services/medical-history';
import { PatientService } from '../../core/services/patient';
import { AuthService } from '../../core/services/auth';
import { Patient } from '../../core/models/patient.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'ponluisa-history-form',
  templateUrl: './history-form.component.html',
  styleUrls: ['./history-form.component.scss'],
  standalone: false
})
export class HistoryFormComponent implements OnInit {
  historyForm!: FormGroup;
  submitted = false;
  patients: Patient[] = [];
  selectedPatientId: string | null = null;
  maxDate: string;

  constructor(
    private formBuilder: FormBuilder,
    private medicalHistoryService: MedicalHistoryService,
    private patientService: PatientService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {
    const today = new Date();
    this.maxDate = today.toISOString();
  }

  ngOnInit() {
    this.loadPatients();

    this.route.queryParams.subscribe(params => {
      this.selectedPatientId = params['patientId'] || null;
    });

    this.initForm();
  }

  loadPatients() {
    this.patients = this.patientService.getAllPatients();
  }

  initForm() {
    this.historyForm = this.formBuilder.group({
      pacienteId: [this.selectedPatientId || '', Validators.required],
      fechaConsulta: [new Date().toISOString(), Validators.required],
      diagnostico: ['', [Validators.required, Validators.minLength(10)]],
      tratamiento: ['', [Validators.required, Validators.minLength(10)]],
      observaciones: ['', Validators.required]
    });
  }

  get f() {
    return this.historyForm.controls;
  }

  getPatientName(id: string): string {
    const patient = this.patients.find(p => p.id === id);
    return patient ? patient.nombreCompleto : '';
  }

  async onSubmit() {
    this.submitted = true;

    if (this.historyForm.invalid) {
      await this.showAlert('Error', 'Por favor complete todos los campos correctamente', 'danger');
      return;
    }

    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      await this.showAlert('Error', 'Debe iniciar sesión', 'danger');
      return;
    }

    const historyData = {
      ...this.historyForm.value,
      medicoId: currentUser.id,
      nombreMedico: currentUser.nombre,
      fechaConsulta: new Date(this.historyForm.value.fechaConsulta)
    };

    this.medicalHistoryService.addHistory(historyData);
    await this.showAlert('Éxito', 'Historia clínica registrada correctamente', 'success');

    this.router.navigate(['/medical-history/patient', this.historyForm.value.pacienteId]);
  }

  async showAlert(header: string, message: string, cssClass: string) {
    const alert = await this.alertController.create({
      header,
      message,
      cssClass,
      buttons: ['OK']
    });

    await alert.present();
  }

  cancel() {
    if (this.selectedPatientId) {
      this.router.navigate(['/patient/detail', this.selectedPatientId]);
    } else {
      this.router.navigate(['/patient/list']);
    }
  }
}