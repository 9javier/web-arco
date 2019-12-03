import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceptionEmptyPackingComponent } from './reception-empty-packing.component';
import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import { ModalComponent } from './modal/modal.component';
import { MatGridListModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';

const routes: Routes = [
  {
    path: '',
    component: ReceptionEmptyPackingComponent,
  },
  {
    path: 'manual',
    component: ModalComponent,
  }
];

@NgModule({
  declarations: [ReceptionEmptyPackingComponent, ModalComponent],
  entryComponents: [ModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatGridListModule,
    CdkTableModule
  ]
})
export class ReceptionEmptyPackingModule { }
