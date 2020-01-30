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
    path: 'logout',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'user-time/:redirect',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/user-time/user-time.module#UserTimeModule',
    data: {
      name: 'Registro horario'
    }
  }, {
    path: 'user-time',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/user-time/user-time.module#UserTimeModule',
    data: {
      name: 'Registro horario'
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
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: './home/home.module#HomePageModule',
    data: {
      name: 'Principal'
    }
  },
  {
    path: 'login',
    loadChildren: '../../../../libs/modules/src/login/login.module#LoginPageModule',
    data: {
      name: 'Login'
    }
  },
  {
    path: 'products',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/products-al/products-al.module#ProductsAlModule',
    data: {
      name: 'Productos'
    }
  },
  {
    path: 'ventilation-no-sorter',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/ventilation-no-sorter/ventilation-no-sorter.module#VentilationNoSorterModule',
    data: {
      name: 'Ventilación sin Sorter'
    }
  },
  {
    path: 'new-products',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/new-products/new-products.module#NewProductsModule',
    data: {
      name: 'Nuevos Productos'
    }
  },
  {
    path: 'building',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/building/building.module#BuildingModule',
    data: {
      name: 'Building'
    }
  },
  {
    path: 'warehouse',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/locations/locations.module#LocationsModule',
    data: {
      name: 'Almacenes'
    }
  },
  {
    path: 'jails',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/jail/jail.module#JailModule',
    data: {
      name: 'Jails'
    }
  },
  {
    path: 'pallets',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/pallets/pallets.module#PalletsModule',
    data: {
      name: 'Pallets'
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
    data: {
      name: 'Almacenes'
    }
  },
  {
    path: 'warehouses/locations',
    canActivate: [AuthGuard],
    loadChildren: '@suite/common-modules#LocationsModule',
    data: {
      name: 'Ubicaciones'
    }
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/settings/settings.module#SettingsModule',
    data: {
      name: 'Ajustes'
    }
  },
  {
    path: 'positioning/manual',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/positioning-manual/positioning-manual.module#PositioningManualModule'
  },
  {
    path: 'positioning/manual-online',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/positioning-manual-online/positioning-manual-online.module#PositioningManualOnlineModule'
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
    data: {
      name: 'Tarifas'
    }
  },
  {
    path: 'prices/:tariffId',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/prices/prices.module#PricesModule',
    data: {
      name: 'Prices'
    }
  },
  {
    path: 'print-tag/manual',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/print-prices-manual/print-prices-manual.module#PrintPricesManualModule',
    data: {
      name: 'Prices'
    }
  },
  {
    path: 'print-tag/manual',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/print-prices-manual/print-prices-manual.module#PrintPricesManualModule',
    data: {
      name: 'Prices'
    }
  },
  {
    path: 'print/packing',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/print-relabel-packing/print-relabel-packing.module#PrintRelabelPackingModule',
    data: {
      name: 'Prices'
    }
  },
  {
    path: 'print/packing/manual',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/print-relabel-packing-manual/print-relabel-packing-manual.module#PrintRelabelPackingManualModule',
    data: {
      name: 'Prices'
    }
  },
  {
    path: 'packing/seal/manual',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/seal-packing-manual/seal-packing-manual.module#SealPackingManualModule',
    data: {
      name: 'Precintar'
    }
  },
  {
    path: 'packing/carrierEmptyPacking',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/reception-empty-packing/reception-empty-packing.module#ReceptionEmptyPackingModule',
    data: {
      name: 'Packing de Jaulas Vacias'
    }
  },
  {
    path: 'sendEmptyPacking',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/send-empty-packing/send-empty-packing.module#SendEmptyPackingModule',
    data: {
      name: 'Send de Jaulas Vacias'
    }
  },
  {
    path: 'print/product/relabel',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/print-relabel-product-manual/print-relabel-product-manual.module#PrintRelabelProductManualModule',
    data: {
      name: 'Retiquetación'
    }
  },
  {
    path: 'print/product/received',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/print-received-product/print-received-product.module#PrintReceivedProductModule',
    data: {
      name: 'Recibidos'
    }
  },
  {
    path: 'print/product/list-products-carrier',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/page-list-products-carrier/page-list-products-carrier.module#PageListProductsCarrierModule',
    data: {
      name: 'Lista de Productos en Jaula'
    }
  },
  {
    path: 'packing/transfer',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/transfer-packing/transfer-packing.module#TransferPackingModule',
    data: {
      name: 'Traspaso'
    }
  },
  {
    path: 'ventilation/transfer',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/transfer-ventilation/transfer-ventilation.module#TransferVentilationModule',
    data: {
      name: 'Ventilación de traspasos'
    }
  },
  {
    path: 'sorter',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/sorter/sorter.module#SorterModule',
    data: {
      name: 'sorter'
    }
  },
  {
    path: 'audits',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/audits-mobile/audits-mobile.module#AuditsMobileModule',
    data: {
      name: 'Auditoria'
    }
  },
  {
    path: 'picking/online-store/verify',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/picking-online-store-verify/picking-online-store-verify.module#PickingOnlineStoreVerifyModule',
    data: {
      name: 'Verificación de artículos'
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
