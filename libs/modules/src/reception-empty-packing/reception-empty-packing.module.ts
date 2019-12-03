import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceptionEmptyPackingComponent } from './reception-empty-packing.component';
import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ReceptionEmptyPackingComponent,
  }
];

@NgModule({
  declarations: [ReceptionEmptyPackingComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
  ]
})
export class ReceptionEmptyPackingModule { }
