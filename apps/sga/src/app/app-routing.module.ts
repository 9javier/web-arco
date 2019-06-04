import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RemoteTokenResolver } from './guards/auth.remove-token-resolver';
//import { UsersModule } from '../../../../libs/modules/src/users/users.module'

const routes: Routes = [
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: './home/home.module#HomePageModule',
    data:{
      name:'Principal'
    }
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/users/users.module#UsersModule',
    data:{
      name: 'Usuarios'
    }
  },
  {
    path: 'roles',
    canActivate: [AuthGuard],
    loadChildren: './roles/roles.module#RolesModule',
    data:{
      name:'Roles'
    }
  },
  {
    path: 'group-to-warehouse',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/group-to-warehouse/group-to-warehouse.module#GroupToWarehouseModule',
    data:{
      name:' Grupos a almacenes'
    }
  },
  {
    path: 'assign',
    canActivate: [AuthGuard],
    loadChildren: './assign/assign.module#AssignModule',
    data:{
      name:'Asignar'
    }
  },
  {
    path: 'login',
    resolve: {
      token: RemoteTokenResolver
    },
    loadChildren: './login/login.module#LoginPageModule',
    data:{
      name:'Login'
    }
  },
  {
    path: 'jails',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/jail/jail.module#JailModule',
    data:{
      name:'Jails'
    }
  },
  {
    path: 'pallets',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/pallets/pallets.module#PalletsModule',
    data:{
      name:'Pallets'
    }
  },
  {
    path: 'permissions',
    loadChildren: './permissions/permissions.module#PermissionsPageModule',
    data:{
      name:'Permisos'
    }
  },
  {
    path: 'warehouses',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/warehouses/warehouses.module#WarehousesModule',
    data:{
      name:'Almacenes'
    }
  },
  {
    path: 'groups',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/groups/groups.module#GroupsModule',
    data:{
      name:'Grupos'
    }
  },
  {
    path: 'user-manager',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/user-manager/user-manager.module#UserManagerModule',
    data:{
      name:'Grupo de usuarios'
    }
  },
  {
    path: 'warehouses/halls',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/halls/halls.module#HallsModule',
    data:{
      name:'Pasillos'
    }
  },
  {
    path: 'products',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/products/products.module#ProductsModule',
    data:{
      name:'Productos'
    }
  },
  {
    path: 'warehouses/locations',
    canActivate: [AuthGuard],
    loadChildren: '@suite/common-modules#LocationsModule',
    data:{
      name:'Ubicaciones'
    }
  },
  {
     path: '',
     redirectTo: 'login',
     pathMatch: 'full'
  },{
    path: '',
    redirectTo: 'logout',
    pathMatch: 'full'    
  },
  {
    path: 'warehouse',
    canActivate: [AuthGuard],
    loadChildren: '@suite/common-modules#LocationsModule',
    data:{
      name:'Almacenes'
    }
  },
  {
    path: 'workwaves-scheduled',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/workwaves-schedule/workwaves-schedule.module#WorkwavesScheduleModule',
    data:{
      name:''
    }
  },
  {
    path: 'workwaves-templates',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/workwaves-templates/workwaves-templates.module#WorkwavesTemplatesModule',
    data:{
      name:''
    }
  },
  {
    path: 'workwave-template',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/workwave-template/workwave-template.module#WorkwaveTemplateModule',
    data:{
      name:''
    }
  },
  {
    path: 'workwaves-history',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/workwaves-history/workwaves-history.module#WorkwavesHistoryModule',
    data:{
      name:''
    }
  },
  {
    path: 'assign/user/picking',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/user-assignment-picking/user-assignment-picking.module#UserAssignmentPickingModule',
    data:{
      name:''
    }
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
