import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IncidencesPopoverComponent } from "./incidences-popover.component";
import { IncidenceSimpleModule } from '../incidence-simple/incidence-simple.module';

@NgModule({
  declarations: [IncidencesPopoverComponent],
  imports: [
    IncidenceSimpleModule,
    CommonModule,
    ReactiveFormsModule,
  ], 
  entryComponents: [IncidencesPopoverComponent],
  exports:[IncidencesPopoverComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IncidencesPopoverModule {}
