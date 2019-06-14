import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PickingManualComponent} from "./picking-manual.component";

const routes: Routes = [
  {
    path: '',
    component: PickingManualComponent
  },
  {
    path: 'list',
    component: PickingManualComponent
  },
  {
    path: 'menu',
    component: PickingManualComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PickingManualRoutingModule {}
