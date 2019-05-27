import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import {IncidencesButtonComponent } from "./incidences-button.component";
import {IncidenceSimpleModule} from "../incidence-simple/incidence-simple.module";
import {IncidencesPopoverModule} from '../incidences-popover/incidences-popover.module';

@NgModule({
  declarations: [IncidencesButtonComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    IncidenceSimpleModule,
    IncidencesPopoverModule
  ], 
  entryComponents: [IncidencesButtonComponent],
  exports: [IncidencesButtonComponent]
})
export class IncidencesButtonModule {}
