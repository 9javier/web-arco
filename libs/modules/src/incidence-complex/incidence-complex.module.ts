import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IncidenceComplexComponent } from "./incidence-complex.component";

@NgModule({
  declarations: [IncidenceComplexComponent],
  exports: [IncidenceComplexComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule
  ], entryComponents: [IncidenceComplexComponent]
})
export class IncidenceComplexModule { }
