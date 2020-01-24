import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IncidenceSimpleComponent } from "./incidence-simple.component";
import { MatTooltipModule } from '@angular/material';

@NgModule({
  declarations: [IncidenceSimpleComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTooltipModule
  ],
  entryComponents: [IncidenceSimpleComponent],
  exports: [IncidenceSimpleComponent],
})
export class IncidenceSimpleModule { }
