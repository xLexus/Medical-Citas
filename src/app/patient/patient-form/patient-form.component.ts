import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../core/services/patient';
import { Patient } from '../../core/models/patient.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'ponluisa-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss'],
  standalone: false
})
export class PatientFormComponent implements OnInit {
  patientForm!: FormGroup;
  submitted = false;
  isEditMode = false;
  patientId: string | null = null;

  tiposSangre = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  generos = ['Masculino', 'Femenino', 'Otro'];

  constructor(
    private formBuilder: FormBuilder,
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.patientId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.patientId;

    this.initForm();

    if (this.isEditMode && this.patientId) {
      this.loadPatient(this.patientId);
    }
  }

  initForm() {
    this.patientForm = this.formBuilder.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      edad: ['', [Validators.required, Validators.min(0), Validators.max(120)]],
      genero: ['', Validators.required],
      tipoSangre: ['', Validators.required],
      telefono: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      direccion: [''],
      historialBasico: ['']
    });
  }

  loadPatient(id: string) {
    const patient = this.patientService.getPatientById(id);
    if (patient) {
      this.patientForm.patchValue({
        nombreCompleto: patient.nombreCompleto,
        edad: patient.edad,
        genero: patient.genero,
        tipoSangre: patient.tipoSangre,
        telefono: patient.telefono || '',
        direccion: patient.direccion || '',
        historialBasico: patient.historialBasico || ''
      });
    }
  }

  get f() {
    return this.patientForm.controls;
  }

  async onSubmit() {
    this.submitted = true;

    if (this.patientForm.invalid) {
      return;
    }

    if (this.isEditMode && this.patientId) {
      const success = this.patientService.updatePatient(this.patientId, this.patientForm.value);
      if (success) {
        await this.showAlert('Éxito', 'Paciente actualizado correctamente');
        this.router.navigate(['/patient/detail', this.patientId]);
      }
    } else {
      const newPatient = this.patientService.addPatient(this.patientForm.value);
      await this.showAlert('Éxito', 'Paciente registrado correctamente');
      this.router.navigate(['/patient/detail', newPatient.id]);
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  cancel() {
    if (this.isEditMode && this.patientId) {
      this.router.navigate(['/patient/detail', this.patientId]);
    } else {
      this.router.navigate(['/patient/list']);
    }
  }
}