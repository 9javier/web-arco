import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PredistributionsComponent } from './predistributions.component';
import { IonicModule } from '@ionic/angular';
import {
  MatCheckboxModule,
  MatPaginatorModule,
  MatRippleModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: PredistributionsComponent
  }
];

@NgModule({
  declarations: [PredistributionsComponent],
  entryComponents: [PredistributionsComponent],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatTableModule,
    MatCheckboxModule,
    MatRippleModule,
    MatPaginatorModule,
    MatSortModule
  ]
})
export class PredistributionsModule { }
