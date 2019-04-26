import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    loadChildren: './users/users.module#UsersModule'
  },
  {
    path: 'roles',
    canActivate: [AuthGuard],
    loadChildren: './roles/roles.module#RolesModule'
  },
  {
    path: 'assign',
    canActivate: [AuthGuard],
    loadChildren: './assign/assign.module#AssignModule'
  },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  {
    path: 'jail',
    canActivate: [AuthGuard],
    loadChildren: './jail/jail.module#JailModule'
  },
  {
    path: 'permissions',
    loadChildren: './permissions/permissions.module#PermissionsPageModule'
  },
  {
    path: 'halls',
    canActivate: [AuthGuard],
    loadChildren: './halls/halls.module#HallsModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
