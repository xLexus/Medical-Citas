import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth';
import { PatientService } from '../core/services/patient';
import { MedicalHistoryService } from '../core/services/medical-history';
import { User } from '../core/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  currentUser: User | null = null;
  stats = {
    pacientes: 0,
    historias: 0,
    medicos: 0
  };

  constructor(
    private authService: AuthService,
    private patientService: PatientService,
    private medicalHistoryService: MedicalHistoryService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadUserData();
    this.loadStats();
  }

  ionViewWillEnter() {
    this.loadUserData();
    this.loadStats();
  }

  loadUserData() {
    this.currentUser = this.authService.currentUserValue;
  }

  loadStats() {
    this.stats.pacientes = this.patientService.getAllPatients().length;

    if (this.currentUser?.rol === 'medico') {
      this.stats.historias = this.medicalHistoryService
        .getAllHistories()
        .filter(h => h.medicoId === this.currentUser?.id).length;
    } else {
      this.stats.historias = this.medicalHistoryService.getAllHistories().length;
    }

    this.stats.medicos = this.authService.getMedicos().length;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}