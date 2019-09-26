import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalVariablesComponent } from './global-variables.component';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatListModule, MatTableModule, MatPaginatorModule } from '@angular/material';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { ModalsModule } from './modals/modals.module';

const routes: Routes = [
  {
    path: '',
    component: GlobalVariablesComponent
  }
];

@NgModule({
  declarations: [GlobalVariablesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    BreadcrumbModule,
    ModalsModule,
    RouterModule.forChild(routes),
    FormsModule
  ]
})
export class GlobalVariablesModule { }
