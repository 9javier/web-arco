import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IncidenceSimpleComponent } from "./incidence-simple.component";

@NgModule({
  declarations: [IncidenceSimpleComponent],
  exports: [IncidenceSimpleComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule
  ], entryComponents: [IncidenceSimpleComponent]
})
export class IncidenceSimpleModule { }
