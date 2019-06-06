import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionToRolComponent } from './permission-to-rol/permission-to-rol.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/per/rol', pathMatch: 'full' },
  {
    path: 'per/rol',
    component: PermissionToRolComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignRoutingModule {}
