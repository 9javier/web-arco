import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PickingTasksStoresComponent } from "./picking-tasks-stores.component";

const routes: Routes = [
  {
    path: '',
    component: PickingTasksStoresComponent
  },
  {
    path: 'list',
    component: PickingTasksStoresComponent
  },
  {
    path: 'menu',
    component: PickingTasksStoresComponent
  },
  {
    path: ':method',
    component: PickingTasksStoresComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PickingTasksStoresRoutingModule {}
