import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TransferPackingComponent} from "./transfer-packing.component";

const routes: Routes = [
  {
    path: '',
    component: TransferPackingComponent
  },
  {
    path: 'list',
    component: TransferPackingComponent
  },
  {
    path: 'menu',
    component: TransferPackingComponent
  },
  {
    path: ':type',
    component: TransferPackingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferPackingRoutingModule {}
