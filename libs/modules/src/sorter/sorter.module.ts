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
import { ModalsModule } from './modals/modals.module';
import { ModalsZoneModule } from './list/modals-zone/modals-zone.module';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material';

const routes:Routes = [
 
  {
    path: '',
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
    ModalsModule,
    ModalsZoneModule,
    RouterModule.forChild(routes),
    BreadcrumbModule,
    MatRadioModule,
    MatFormFieldModule,
    MatSelectModule
  ]
})
export class SorterModule { }
