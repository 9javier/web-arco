import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PrintPricesManualComponent} from "./print-prices-manual.component";

const routes: Routes = [
  {
    path: '',
    component: PrintPricesManualComponent
  },
  {
    path: 'list',
    component: PrintPricesManualComponent
  },
  {
    path: 'menu',
    component: PrintPricesManualComponent
  },
  {
    path: ':type',
    component: PrintPricesManualComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintPricesManualRoutingModule {}
