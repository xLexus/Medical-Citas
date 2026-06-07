import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicoListComponent } from './medico-list/medico-list.component';

const routes: Routes = [
  {
    path: 'medicos',
    component: MedicoListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
