import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TariffComponent } from './tariff.component';
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatListModule, MatTableModule, MatPaginatorModule } from '@angular/material';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';

const routes:Routes = [
  {
    path: '',
    component: TariffComponent
  }
]; 

@NgModule({
  declarations: [TariffComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    BreadcrumbModule,
    RouterModule.forChild(routes),
  ]
})
export class TariffModule { }