import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'ponluisa-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  standalone: false
})
export class RegistroComponent implements OnInit {
  registroForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.registroForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      rol: ['medico', Validators.required],
      especialidad: [''],
      registroMedico: ['']
    }, {
      validators: this.passwordMatchValidator
    });

    // Escuchar cambios en el rol
    this.registroForm.get('rol')?.valueChanges.subscribe(rol => {
      if (rol === 'medico') {
        this.registroForm.get('especialidad')?.setValidators(Validators.required);
        this.registroForm.get('registroMedico')?.setValidators(Validators.required);
      } else {
        this.registroForm.get('especialidad')?.clearValidators();
        this.registroForm.get('registroMedico')?.clearValidators();
      }
      this.registroForm.get('especialidad')?.updateValueAndValidity();
      this.registroForm.get('registroMedico')?.updateValueAndValidity();
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  get f() {
    return this.registroForm.controls;
  }

  get isMedico() {
    return this.registroForm.get('rol')?.value === 'medico';
  }

  async onSubmit() {
    this.submitted = true;

    if (this.registroForm.invalid) {
      return;
    }

    const { confirmPassword, ...registerData } = this.registroForm.value;
    const success = this.authService.register(registerData);

    if (success) {
      await this.showAlert('Éxito', 'Registro exitoso. Ahora puede iniciar sesión.', 'success');
      this.router.navigate(['/auth/login']);
    } else {
      await this.showAlert('Error', 'El correo ya está registrado', 'danger');
    }
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

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}