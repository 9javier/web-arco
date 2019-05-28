import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IncidenceSimpleComponent } from "./incidence-simple.component";

@NgModule({
  declarations: [IncidenceSimpleComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule
  ],
  entryComponents: [IncidenceSimpleComponent],
  exports: [IncidenceSimpleComponent],
})
export class IncidenceSimpleModule { }
