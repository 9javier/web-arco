import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import {
  
  MatTableModule,
 
} from '@angular/material';

import { LabelsManualComponent } from './labels-manual.component';


const routes: Routes = [
  {
    path: '',
    component: LabelsManualComponent
  }
];

@NgModule({
  declarations: [LabelsManualComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatListModule,
    MatTableModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LabelsManualModule { }
