import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PrintRelabelProductManualComponent} from "./print-relabel-product-manual.component";

const routes: Routes = [
  {
    path: '',
    component: PrintRelabelProductManualComponent
  },
  {
    path: 'list',
    component: PrintRelabelProductManualComponent
  },
  {
    path: 'menu',
    component: PrintRelabelProductManualComponent
  },
  {
    path: ':type',
    component: PrintRelabelProductManualComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintRelabelProductManualRoutingModule {}
