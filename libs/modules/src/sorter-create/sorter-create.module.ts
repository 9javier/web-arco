import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SorterCreateComponent } from './sorter-create.component';
import { Routes, RouterModule } from '@angular/router';
import { ModalsModule } from './modals/modals.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatTableModule, MatIconModule, MatGridListModule } from '@angular/material';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material';


const routes:Routes = [
  {
    path: '', 
    component: SorterCreateComponent
  },
]; 

@NgModule({
  declarations: [SorterCreateComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatIconModule,
    MatGridListModule,
    ModalsModule,
    BreadcrumbModule,
    MatFormFieldModule,
    MatSelectModule,
    RouterModule.forChild(routes),
  ]
})
export class SorterCreateModule { }