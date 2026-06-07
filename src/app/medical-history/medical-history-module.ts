import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MedicalHistoryRoutingModule } from './medical-history-routing-module';

// Importar los componentes
import { HistoryListComponent } from './history-list/history-list.component';
import { HistoryFormComponent } from './history-form/history-form.component';
import { PatientHistoryComponent } from './patient-history/patient-history.component';

@NgModule({
  declarations: [
    HistoryListComponent,
    HistoryFormComponent,
    PatientHistoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MedicalHistoryRoutingModule
  ]
})
export class MedicalHistoryModule { }