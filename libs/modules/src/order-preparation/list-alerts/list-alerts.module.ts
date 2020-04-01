import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from '@angular/common';
import { MatListModule, MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material';


import { ListAlertsComponent } from '././list-alerts.component';


const routes: Routes = [
  {
    path: '',
    component: ListAlertsComponent
  }
];

@NgModule({
  declarations: [ListAlertsComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LabelsManualModule { }
