import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { MedicalHistoryService } from '../../core/services/medical-history';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'ponluisa-medico-list',
  templateUrl: './medico-list.component.html',
  styleUrls: ['./medico-list.component.scss'],
  standalone: false
})
export class MedicoListComponent implements OnInit {
  medicos: User[] = [];
  filteredMedicos: User[] = [];
  searchTerm: string = '';
  medicosStats: Map<string, number> = new Map();

  constructor(
    private authService: AuthService,
    private medicalHistoryService: MedicalHistoryService
  ) { }

  ngOnInit() {
    this.loadMedicos();
    this.calculateStats();
  }

  loadMedicos() {
    this.medicos = this.authService.getMedicos();
    this.filteredMedicos = [...this.medicos];
  }

  calculateStats() {
    const allHistories = this.medicalHistoryService.getAllHistories();

    this.medicos.forEach(medico => {
      const count = allHistories.filter(h => h.medicoId === medico.id).length;
      this.medicosStats.set(medico.id, count);
    });
  }

  searchMedicos(event: any) {
    this.searchTerm = event.target.value.toLowerCase();

    if (!this.searchTerm) {
      this.filteredMedicos = [...this.medicos];
      return;
    }

    this.filteredMedicos = this.medicos.filter(medico =>
      medico.nombre.toLowerCase().includes(this.searchTerm) ||
      (medico.especialidad && medico.especialidad.toLowerCase().includes(this.searchTerm)) ||
      (medico.registroMedico && medico.registroMedico.toLowerCase().includes(this.searchTerm))
    );
  }

  getConsultasCount(medicoId: string): number {
    return this.medicosStats.get(medicoId) || 0;
  }
}