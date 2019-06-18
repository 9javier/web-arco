import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkwavesScheduleComponent } from "./workwaves-schedule.component";
import {ListPickingComponent} from "../list-picking/list-picking.component";

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
    component: ListPickingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkwavesScheduleRoutingModule {}
