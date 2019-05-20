import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IncidencesPopoverComponent } from "./incidences-popover.component";

@NgModule({
  declarations: [IncidencesPopoverComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule
  ], entryComponents: [IncidencesPopoverComponent]
})
export class IncidencesPopoverModule { }
