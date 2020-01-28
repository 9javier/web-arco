import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PositioningManualOnlineComponent} from "./positioning-manual-online.component";

const routes: Routes = [
  {
    path: '',
    component: PositioningManualOnlineComponent
  },
  {
    path: 'list',
    component: PositioningManualOnlineComponent
  },
  {
    path: 'menu',
    component: PositioningManualOnlineComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PositioningManualOnlineRoutingModule {}
