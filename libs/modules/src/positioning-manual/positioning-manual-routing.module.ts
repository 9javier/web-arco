import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PositioningManualComponent} from "./positioning-manual.component";

const routes: Routes = [
  {
    path: '',
    component: PositioningManualComponent
  },
  {
    path: 'list',
    component: PositioningManualComponent
  },
  {
    path: 'menu',
    component: PositioningManualComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PositioningManualRoutingModule {}
