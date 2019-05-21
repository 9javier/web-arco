import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {IncidencesButtonComponent} from "@suite/common-modules";
import {IncidencesPopoverComponent} from "../incidences-popover/incidences-popover.component"
import {IncidenceSimpleModule} from "../incidence-simple/incidence-simple.module";

@NgModule({
  declarations: [IncidencesButtonComponent, IncidencesPopoverComponent],
  exports: [IncidencesButtonComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    IncidenceSimpleModule
  ], entryComponents: [IncidencesButtonComponent, IncidencesPopoverComponent]
})
export class IncidencesButtonModule { }
