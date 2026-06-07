import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'ponluisa-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  async onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const credentials = this.loginForm.value;
    const success = this.authService.login(credentials);

    if (success) {
      await this.showAlert('Éxito', 'Inicio de sesión exitoso', 'success');
      this.router.navigate(['/home']);
    } else {
      await this.showAlert('Error', 'Credenciales inválidas', 'danger');
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

  goToRegister() {
    this.router.navigate(['/auth/registro']);
  }
}