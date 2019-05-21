import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {IncidencesListComponent} from "./incidences-list.component";
import {IncidenceComplexModule} from "../incidence-complex/incidence-complex.module";

@NgModule({
  declarations: [IncidencesListComponent],
  exports: [IncidencesListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    IncidenceComplexModule
  ], entryComponents: [IncidencesListComponent]
})
export class IncidencesListModule { }
