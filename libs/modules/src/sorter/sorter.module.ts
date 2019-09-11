import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SorterComponent } from './sorter.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatTableModule, MatIconModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import {ListComponent} from './list/list.component';

const routes:Routes = [
  {
    path: '',
    component: SorterComponent
  }
]; 

@NgModule({
  declarations: [SorterComponent, ListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatIconModule,
    RouterModule.forChild(routes),
    BreadcrumbModule
  ]
})
export class SorterModule { }
