import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolToUserComponent } from './rol-to-user/rol-to-user.component';
import { PermissionToRolComponent } from './permission-to-rol/permission-to-rol.component';
import { AuthGuard } from '../guards/auth.guard';
import {GroupToWarehouseComponent} from "./group-to-warehouse/group-to-warehouse.component";

const routes: Routes = [
  { path: '', redirectTo: '/assign/rol/user', pathMatch: 'full' },
  { path: 'rol/user', component: RolToUserComponent, canActivate: [AuthGuard] },
  {
    path: 'per/rol',
    component: PermissionToRolComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'group/ware',
    component: GroupToWarehouseComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignRoutingModule {}
