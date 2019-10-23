import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RacksRoutingModule } from './racks-routing.module';
import { RacksComponent } from './racks.component';
import { IonicModule } from '@ionic/angular';
import { MatCheckboxModule, MatTableModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RacksComponent],
  imports: [
    CommonModule,
    RacksRoutingModule,
    IonicModule,
    MatTableModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ]
})
export class RacksModule { }
