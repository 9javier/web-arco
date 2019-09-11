import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SorterComponent } from './sorter.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MatExpansionModule} from '@angular/material/expansion';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';

const routes:Routes = [
  {
    path: '',
    component: SorterComponent
  }
]; 

@NgModule({
  declarations: [SorterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MatExpansionModule,
    RouterModule.forChild(routes),
    BreadcrumbModule
  ]
})
export class SorterModule { }
