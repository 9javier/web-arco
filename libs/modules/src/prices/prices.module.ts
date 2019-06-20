import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricesComponent } from './prices.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatListModule, MatTableModule, MatPaginatorModule } from '@angular/material';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { RouterModule,Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: PricesComponent
  }
]; 

@NgModule({
  declarations: [PricesComponent],
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
export class PricesModule { }
