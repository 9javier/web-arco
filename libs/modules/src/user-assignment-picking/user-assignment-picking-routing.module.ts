import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserAssignmentPickingComponent } from "./user-assignment-picking.component";

const routes: Routes = [
  {
    path: '',
    component: UserAssignmentPickingComponent
  },
  {
    path: ':id',
    component: UserAssignmentPickingComponent
  },
  {
    path: 'list',
    component: UserAssignmentPickingComponent
  },
  {
    path: 'menu',
    component: UserAssignmentPickingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAssignmentPickingRoutingModule {}
