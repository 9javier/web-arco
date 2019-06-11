import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatTableModule } from '@angular/material';
import { MatListModule } from '@angular/material';
import { RouterModule, Routes } from "@angular/router";
import { MatPaginatorModule } from '@angular/material';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';

import { LabelsComponent } from './labels.component';

const routes: Routes = [
  {
    path: '',
    component: LabelsComponent
  }
]; 

@NgModule({
  declarations: [LabelsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    BreadcrumbModule,
    RouterModule.forChild(routes),
  ],
  exports:[LabelsComponent]
})
export class LabelsModule { }
