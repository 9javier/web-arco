import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupWarehousePickingComponent } from './group-warehouse-picking.component';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MatListModule, MatTableModule, MatPaginatorModule } from '@angular/material';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { StoreModule } from './modals/store/store.module';
import { UpdateModule } from './modals/update/update.module';
import { ReactiveFormsModule } from '@angular/forms';

const routes:Routes = [
  {
    path: '',
    component: GroupWarehousePickingComponent
  }
];
@NgModule({
  declarations: [GroupWarehousePickingComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    BreadcrumbModule,
    StoreModule,
    UpdateModule,
    ReactiveFormsModule
  ]
})
export class GroupWarehousePickingModule { }
