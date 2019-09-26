import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SorterComponent } from './sorter.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatTableModule, MatIconModule } from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { CdkTableModule } from '@angular/cdk/table';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { ListComponent } from './list/list.component';

const routes:Routes = [
  {path: '', redirectTo: 'plantillas', pathMatch: 'full' },
  {
    path: 'plantillas',
    component: SorterComponent,
    data: {
      name: 'Plantillas'
    }
  },
  {
    path: 'plantilla/:id',
    component: ListComponent,
    data: {
      name: 'Plantilla'
    }
  },
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
    MatGridListModule,
    RouterModule.forChild(routes),
    BreadcrumbModule
  ]
})
export class SorterModule { }
