import { FormsModule } from '@angular/forms';
import { ComponentsModule } from './../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceptionEmptyPackingComponent } from './reception-empty-packing.component';
import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import { ModalComponent } from './modal/modal.component';

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
    FormsModule
  ]
})
export class ReceptionEmptyPackingModule { }
