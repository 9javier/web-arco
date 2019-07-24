import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupWarehousePickingComponent } from './group-warehouse-picking.component';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

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
    RouterModule.forChild(routes)
  ]
})
export class GroupWarehousePickingModule { }
