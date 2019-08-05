import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SealPackingManualComponent} from "./seal-packing-manual.component";

const routes: Routes = [
  {
    path: '',
    component: SealPackingManualComponent
  },
  {
    path: 'list',
    component: SealPackingManualComponent
  },
  {
    path: 'menu',
    component: SealPackingManualComponent
  },
  {
    path: ':type',
    component: SealPackingManualComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SealPackingManualRoutingModule {}
