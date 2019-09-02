import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkwavesScheduleComponent } from "./workwaves-schedule.component";
import {ListPickingRebuildComponent} from "../list-picking-rebuild/list-picking-rebuild.component";

const routes: Routes = [
  {
    path: '',
    component: WorkwavesScheduleComponent
  },
  {
    path: 'list',
    component: WorkwavesScheduleComponent
  },
  {
    path: 'menu',
    component: WorkwavesScheduleComponent
  },
  {
    path: 'pickings',
    component: ListPickingRebuildComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkwavesScheduleRoutingModule {}
