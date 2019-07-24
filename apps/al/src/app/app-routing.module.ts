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
    loadChildren: '../../../../libs/modules/src/login/login.module#LoginPageModule',
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
  },{
    path: 'building',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/building/building.module#BuildingModule',
    data:{
      name:'Building'
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
    path: 'warehouses',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/warehouses/warehouses.module#WarehousesModule',
    data:{
      name:'Almacenes'
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
  {
    path: 'picking/manual',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/picking-manual/picking-manual.module#PickingManualModule'
  },
  {
    path: 'tariff',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/tariff/tariff.module#TariffModule',
    data:{
      name: 'Tarifas'
    }
  },
  {
    path: 'prices/:tariffId',
    canActivate:[AuthGuard],
    loadChildren: '../../../../libs/modules/src/prices/prices.module#PricesModule',
    data:{
      name:'Prices'
    }
  },
  {
    path: 'print-tag/manual',
    canActivate:[AuthGuard],
    loadChildren: '../../../../libs/modules/src/print-prices-manual/print-prices-manual.module#PrintPricesManualModule',
    data:{
      name: 'Prices'
    }
  },
  {
    path: 'print-tag/manual',
    canActivate:[AuthGuard],
    loadChildren: '../../../../libs/modules/src/print-prices-manual/print-prices-manual.module#PrintPricesManualModule',
    data:{
      name: 'Prices'
    }
  },
  {
    path: 'print/packing',
    canActivate:[AuthGuard],
    loadChildren: '../../../../libs/modules/src/print-relabel-packing/print-relabel-packing.module#PrintRelabelPackingModule',
    data:{
      name: 'Prices'
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
