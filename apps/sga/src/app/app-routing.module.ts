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
    {
      path: 'login',
      resolve: {
        token: RemoteTokenResolver
      },
      loadChildren: '../../../../libs/modules/src/login/login.module#LoginPageModule',
      data: {
        name: 'Login'
      }
    },
    {
      path: '',
      redirectTo: 'login',
      pathMatch: 'full'
    },
    {
      path: 'logout',
      redirectTo: 'login',
      pathMatch: 'full'
    },
    {
      path: 'status-onboarding',
      canActivate: [AuthGuard],
      loadChildren: '../../../../libs/modules/src/status-onboarding/status-onboarding.module#StatusOnBoardingModule',
      data: {
        name: 'Brands'
      }
    },
    {
      path: 'welcome',
      canActivate: [AuthGuard],
      loadChildren: './welcome/welcome.module#WelcomePageModule',
      data: {
        name: 'Bienvenido' 
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
