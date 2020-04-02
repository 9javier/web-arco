import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import {
  
  MatTableModule,
 
} from '@angular/material';

import { TransportManifestComponent } from './transport-manifest.component';


const routes: Routes = [
  {
    path: '',
    component: TransportManifestComponent
  }
];

@NgModule({
  declarations: [TransportManifestComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatListModule,
    MatTableModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TransportManifestModule { }
