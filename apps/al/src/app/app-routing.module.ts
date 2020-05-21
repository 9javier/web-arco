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
  },
/*  {
    path: 'user-time',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/user-time/user-time.module#UserTimeModule',
    data: {
      name: 'Registro horario'
    }
  },*/
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
    path: 'picking-scan-packing',
    loadChildren: '../../../../libs/modules/src/picking-scan-packing/picking-scan-packing.module#PickingScanPackingModule',
    data: {
      name: 'Asociar pares a embalajes'
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
    path: 'order-preparation',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/order-preparation/order-preparation.module#OrderPreparationModule',
    data: {
      name: 'Preparacion de pedidos'
    }

  },
  {
    path: 'list-alerts',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/transport-manifest/transport-manifest.module#TransportManifestModule',
    data: {
      name: 'Manifiesto transportista'
    }
  },
  {
    path: 'order-no-processed',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/order-no-processed/order-no-processed.module#OrderNoProcesse2dModule',
    data: {
      name: 'Órdenes no procesadas'
    }
  },
  {
    path: 'labels-manual',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/labels-manual/labels-manual.module#LabelsManualModule',
    data: {
      name: 'Etiquetas manuales'
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
    path: 'requested-products',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/requested-products/requested-products.module#RequestedProductsModule',
    data: {
      name: 'Productos solicitados'
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
    path: 'picking-tasks-stores',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/picking-tasks-stores/picking-tasks-stores.module#PickingTasksStoresModule'
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
      name: 'Código impresora'
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
    path: 'unfit-online-products',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/unfit-online-products/unfit-online-products.module#UnfitOnlineProductsModule',
    data: {
      name: 'Lista de productos no aptos online'
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
  },
  {
    path: 'expeditions/pending/app',
    canActivate:[AuthGuard],
    loadChildren: '../../../../libs/modules/src/expeditions-pending-app/expeditions-pending-app.module#ExpeditionsPendingAppModule',
    data: {
      name: 'Expediciones pendientes'
    }
  },
  {
    path: 'receptions-avelon/app',
    canActivate:[AuthGuard],
    loadChildren: '../../../../libs/modules/src/receptions-avelon-app/receptions-avelon-app.module#ReceptionsAvelonAppModule',
    data: {
      name: 'Recepción mercancía'
    }
  },
  {
    path: 'incidents',
    canActivate:[AuthGuard],
    loadChildren: '../../../../libs/modules/src/incidents/incidents.module#IncidentsModule',
    data: {
      name: 'Incidencias'
    }
  },
  {
    path: 'defect-handler',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/defect-handler/defect-handler.module#DefectHandlerModule',
    data: {
      name: 'Manejo de defectos'
    }
  },
  {
    path: 'signature',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/signature/signature.module#SignatureModule',
    data: {
      name: 'Manejo de defectos'
    }
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
