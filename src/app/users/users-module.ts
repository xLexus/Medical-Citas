import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { UsersRoutingModule } from './users-routing-module';
import { MedicoListComponent } from './medico-list/medico-list.component';

@NgModule({
  declarations: [
    MedicoListComponent  // ✅ lo declaras aquí
  ],
  imports: [
    CommonModule,         // ✅ necesario para *ngIf, *ngFor
    FormsModule,          // ✅ para [(ngModel)] y formularios simples
    ReactiveFormsModule,  // ✅ por si usas formularios reactivos
    IonicModule,          // ✅ necesario para componentes ion-*
    UsersRoutingModule
  ]
})
export class UsersModule { }
