import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkwavesScheduleComponent } from "./workwaves-schedule.component";

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkwavesScheduleRoutingModule {}
