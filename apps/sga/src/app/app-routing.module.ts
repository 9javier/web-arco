import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RemoteTokenResolver } from './guards/auth.remove-token-resolver';
//import { UsersModule } from '../../../../libs/modules/src/users/users.module'

const routes: Routes = [
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/users/users.module#UsersModule'
  },
  {
    path: 'roles',
    canActivate: [AuthGuard],
    loadChildren: './roles/roles.module#RolesModule'
  },
  {
    path: 'group-to-warehouse',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/group-to-warehouse/group-to-warehouse.module#GroupToWarehouseModule'
  },
  {
    path: 'assign',
    canActivate: [AuthGuard],
    loadChildren: './assign/assign.module#AssignModule'
  },
  {
    path: 'login',
    resolve: {
      token: RemoteTokenResolver
    },
    loadChildren: './login/login.module#LoginPageModule'
  },
  {
    path: 'jails',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/jail/jail.module#JailModule'
  },
  {
    path: 'pallets',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/pallets/pallets.module#PalletsModule'
  },
  {
    path: 'permissions',
    loadChildren: './permissions/permissions.module#PermissionsPageModule'
  },
  {
    path: 'warehouses',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/warehouses/warehouses.module#WarehousesModule'
  },
  {
    path: 'groups',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/groups/groups.module#GroupsModule'
  },
  {
    path: 'user-manager',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/user-manager/user-manager.module#UserManagerModule'
  },
  {
    path: 'warehouses/halls',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/halls/halls.module#HallsModule'
  },
  {
    path: 'products',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/products/products.module#ProductsModule'
  },
  {
    path: 'warehouses/locations',
    canActivate: [AuthGuard],
    loadChildren: '@suite/common-modules#LocationsModule'
  },
  {
     path: '',
     redirectTo: 'login',
     pathMatch: 'full'
  },
  {
    path: 'warehouse',
    canActivate: [AuthGuard],
    loadChildren: '@suite/common-modules#LocationsModule'
  },
  {
    path: 'workwaves',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/workwaves/workwaves.module#WorkwavesModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [RemoteTokenResolver]
})
export class AppRoutingModule { }
