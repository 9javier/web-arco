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
    loadChildren: './home/home.module#HomePageModule',
    data:{
      name:'Principal'
    }
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginPageModule',
    data:{
      name:'Login'
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
    path: 'warehouse',
    canActivate: [AuthGuard],
    loadChildren: '@suite/common-modules#LocationsModule',
    data:{
      name:'Almacenes'
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
    path: 'picking-tasks',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/picking-tasks/picking-tasks.module#PickingTasksModule'
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/settings/settings.module#SettingsModule',
    data:{
      name:'Ajustes'
    }
  },
  {
    path: 'positioning/manual',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/positioning-manual/positioning-manual.module#PositioningManualModule'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
