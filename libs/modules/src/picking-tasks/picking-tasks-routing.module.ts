import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PickingTasksComponent } from "./picking-tasks.component";

const routes: Routes = [
  {
    path: '',
    component: PickingTasksComponent
  },
  {
    path: 'list',
    component: PickingTasksComponent
  },
  {
    path: 'menu',
    component: PickingTasksComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PickingTasksRoutingModule {}
