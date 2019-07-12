import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricesComponent } from './prices.component';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatListModule, MatTableModule, MatPaginatorModule, MatExpansionModule, MatSlideToggleModule } from '@angular/material';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { RouterModule,Routes } from '@angular/router';
import { ResponsiveLayoutModule } from '../components/responsive-layout/responsive-layout.module';

const routes: Routes = [
  {
    path: '',
    component: PricesComponent
  }
]; 

@NgModule({
  declarations: [PricesComponent],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    BreadcrumbModule,
    RouterModule.forChild(routes),
    ResponsiveLayoutModule,
    MatExpansionModule,
    MatSlideToggleModule
  ]
})
export class PricesModule { }
