import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth';
import { PatientService } from './services/patient';
import { MedicalHistoryService } from './services/medical-history';
import { AuthGuard } from './guards/auth-guard';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    AuthService,
    PatientService,
    MedicalHistoryService,
    AuthGuard
  ]
})
export class CoreModule { }