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
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  {
    path: 'products',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/products/products.module#ProductsModule'
  },
  {
    path: 'warehouse',
    canActivate: [AuthGuard],
    loadChildren: '@suite/common-modules#LocationsModule'
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
    path: 'picking-tasks',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/picking-tasks/picking-tasks.module#PickingTasksModule'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
