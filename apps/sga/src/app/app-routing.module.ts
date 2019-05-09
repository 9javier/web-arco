import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RemoteTokenResolver } from './guards/auth.remove-token-resolver';

const routes: Routes = [
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
  { path: 'login',
    resolve: {
     token: RemoteTokenResolver
  },
  loadChildren: './login/login.module#LoginPageModule' },
  {
    path: 'jails',
    canActivate: [AuthGuard],
    loadChildren: './jail/jail.module#JailModule'
  },
  {
    path: 'pallets',
    canActivate: [AuthGuard],
    loadChildren: './pallets/pallets.module#PalletsModule'
  },
  {
    path: 'permissions',
    loadChildren: './permissions/permissions.module#PermissionsPageModule'
  },
  {
    path: 'warehouses',
    canActivate: [AuthGuard],
    loadChildren: './warehouses/warehouses.module#WarehousesModule'
  },
  {
    path: 'groups',
    canActivate: [AuthGuard],
    loadChildren: './groups/groups.module#GroupsModule'
  },
  {
    path: 'warehouses/halls',
    canActivate: [AuthGuard],
    loadChildren: './halls/halls.module#HallsModule'
  },
  {
    path: 'warehouses/locations',
    canActivate: [AuthGuard],
    loadChildren: './locations/locations.module#LocationsModule'
  },
  {
     path: '',
     redirectTo: 'login',
     pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules  })
  ],
  exports: [RouterModule],
  providers: [RemoteTokenResolver]
})
export class AppRoutingModule {}
