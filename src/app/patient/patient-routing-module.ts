import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { AuthGuard } from '../core/guards/auth-guard';

const routes: Routes = [
  {
    path: 'list',
    component: PatientListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'form',
    component: PatientFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'form/:id',
    component: PatientFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'detail/:id',
    component: PatientDetailComponent,
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
  exports: [RouterModule],
})
export class PatientRoutingModule { }