import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TransferVentilationComponent} from "./transfer-ventilation.component";

const routes: Routes = [
  {
    path: '',
    component: TransferVentilationComponent
  },
  {
    path: 'list',
    component: TransferVentilationComponent
  },
  {
    path: 'menu',
    component: TransferVentilationComponent
  },
  {
    path: ':type',
    component: TransferVentilationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferVentilationRoutingModule {}
