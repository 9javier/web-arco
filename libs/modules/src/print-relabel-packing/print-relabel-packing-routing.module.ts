import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrintRelabelPackingComponent } from "./print-relabel-packing.component";

const routes: Routes = [
  {
    path: '',
    component: PrintRelabelPackingComponent
  },
  {
    path: 'list',
    component: PrintRelabelPackingComponent
  },
  {
    path: 'menu',
    component: PrintRelabelPackingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintRelabelPackingRoutingModule {}
