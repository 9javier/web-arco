import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RemoteTokenResolver } from './guards/auth.remove-token-resolver';
//import { UsersModule } from '../../../../libs/modules/src/users/users.module'

const routes: Routes = [
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/home/home.module#HomePageModule',
    data: {
      name: 'Principal'
    }
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/users/users.module#UsersModule',
    data: {
      name: 'Usuarios'
    }
  },
  {
    path: 'brands',
      canActivate: [AuthGuard],
      loadChildren: '../../../../libs/modules/src/brands/brands.module#BrandsModule',
      data: {
        name: 'Brands'
      }
    },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [RemoteTokenResolver]
})
export class AppRoutingModule { }
