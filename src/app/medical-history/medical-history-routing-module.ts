import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoryListComponent } from './history-list/history-list.component';
import { HistoryFormComponent } from './history-form/history-form.component';
import { PatientHistoryComponent } from './patient-history/patient-history.component';
import { AuthGuard } from '../core/guards/auth-guard';

const routes: Routes = [
  {
    path: 'list',
    component: HistoryListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'form',
    component: HistoryFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'form/:id',
    component: HistoryFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'patient/:patientId',
    component: PatientHistoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicalHistoryRoutingModule { }