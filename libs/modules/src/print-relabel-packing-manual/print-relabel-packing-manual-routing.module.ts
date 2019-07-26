import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PrintRelabelPackingManualComponent} from "./print-relabel-packing-manual.component";

const routes: Routes = [
  {
    path: '',
    component: PrintRelabelPackingManualComponent
  },
  {
    path: 'list',
    component: PrintRelabelPackingManualComponent
  },
  {
    path: 'menu',
    component: PrintRelabelPackingManualComponent
  },
  {
    path: ':type',
    component: PrintRelabelPackingManualComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintRelabelPackingManualRoutingModule {}
