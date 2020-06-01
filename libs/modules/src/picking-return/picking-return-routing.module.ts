import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PickingReturnComponent} from "./picking-return.component";

const routes: Routes = [
  {
    path: '',
    component: PickingReturnComponent
  },
  {
    path: 'list',
    component: PickingReturnComponent
  },
  {
    path: 'menu',
    component: PickingReturnComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PickingReturnRoutingModule {}
