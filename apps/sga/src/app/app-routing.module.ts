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
    path: 'calendar',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/calendar-picking//calendar-picking.module#CalendarPickingModule',
    data: {
      name: 'Calendario'
    }
  }, {
    path: 'calendar-sga',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/calendar-sga//calendar-sga.module#CalendarSgaModule',
    data: {
      name: 'Calendario SGA'
    }
  },
  {
    path: 'roles',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/roles/roles.module#RolesModule',
    data: {
      name: 'Roles'
    }
  },
  {
    path: 'group-to-warehouse',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/group-to-warehouse/group-to-warehouse.module#GroupToWarehouseModule',
    data: {
      name: 'Asignar grupos de tiendas'
    }
  },
  {
    path: 'assign',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/assign/assign.module#AssignModule',
    data: {
      name: 'Asignar'
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
    path: 'group-warehouse-picking',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/group-warehouse-picking/group-warehouse-picking.module#GroupWarehousePickingModule',
    data: {
      name: 'Grupos de almacenes para picking'
    }
  },
  {
    path: 'jails',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/jail/jail.module#JailModule',
    data: {
      name: 'Jaulas'
    }
  },
  {
    path: 'state-expedition-avelon',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/state-expedition-avelon/state-expedition-avelon.module#StateExpeditionAvelonModule',
    data: {
      name: 'Estados'
    }
  },
  {
    path: 'commercial-fields',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/commercial-fields/commercial-fields.module#CommercialFieldsModule',
    data: {
      name: 'Campos Comerciales'
    }
  },
  {
    path: 'brands-enabled-reception',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/brands-enabled-reception/brands-enabled-reception.module#BrandsEnabledReceptionModule',
    data: {
      name: 'Marcas habilitadas recepción sin pedido'
    }
  },
  {
    path: 'pallets',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/pallets/pallets.module#PalletsModule',
    data: {
      name: 'Paletas'
    }
  },
  {
    path: 'permissions',
    loadChildren: '../../../../libs/modules/src/permissions/permissions.module#PermissionsPageModule',
    data: {
      name: 'Permisos'
    }
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
    path: 'groups',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/groups/groups.module#GroupsModule',
    data: {
      name: 'Grupo de tiendas'
    }
  },
  {
    path: 'user-manager',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/user-manager/user-manager.module#UserManagerModule',
    data: {
      name: 'Parametrización de operarios'
    }
  },
  {
    path: 'role-assignment',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/role-assignment/role-assignment.module#RoleAssignmentModule',
    data: {
      name: 'Asignación de roles'
    }
  },
  {
    path: 'damaged-shoes',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/damaged-shoes/damaged-shoes.module#DamagedShoesModule',
    data: {
      name: 'Parametrización de Daños'
    }
  },
  {
    path: 'defective-management',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/defective-management/defective-management.module#DefectiveManagementModule',
    data: {
      name: 'Tipos de defectos'
    }
  }, {
    path: 'defective-zones',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/defective-zones/defective-zones.module#DefectiveZonesModule',
    data: {
      name: 'Zonas'
    }
  },
  {
    path: 'defective-registry',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/defective-registry/defective-registry.module#DefectiveRegistryModule',
    data: {
      name: 'Registro de Defectuosos'
    }
  },
  {
    path: 'defective-historic',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/defective-historic/defective-historic.module#DefectiveHistoricModule',
    data: {
      name: 'Historico Defectuosos'
    }
  },
  {
    path: 'supplier-conditions',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/supplier-conditions/supplier-conditions.module#SupplierConditionsModule',
    data: {
      name: 'Condiciones de Proveedores'
    }
  },
  {
    path: 'return-types',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/return-types/return-types.module#ReturnTypesModule',
    data: {
      name: 'Tipos de Devoluciones'
    }
  },
  {
    path: 'returns-list',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/returns-list/returns-list.module#ReturnsListModule',
    data: {
      name: 'Lista'
    }
  },
  {
    path: 'returns-historic',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/returns-historic/returns-historic.module#ReturnsHistoricModule',
    data: {
      name: 'Listado de Histórico de Devoluciones'
    }
  },
  {
    path: 'returns-list-products',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/returns-list-products/returns-list-products.module#ReturnsListProductsModule',
    data: {
      name: 'Lista de Productos Devueltos'
    }
  },
  {
    path: 'return-tracking-list',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/return-tracking-list/return-tracking-list.module#ReturnTrackingListModule',
    data: {
      name: 'Listado de Seguimiento de Devoluciones'
    }
  },
  {
    path: 'new-return',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/new-return/new-return.module#NewReturnModule',
    data: {
      name: 'Crear Nueva Devolución'
    }
  },
  {
    path: 'warehouses/halls',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/halls/halls.module#HallsModule',
    data: {
      name: 'Pasillos'
    }
  },
  {
    path: 'products',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/products/products.module#ProductsModule',
    data: {
      name: 'Productos'
    }
  },
  {
    path: 'list-new-products',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/list-new-products/list-new-products.module#ListNewProductsComponentModule',
    data: {
      name: 'Nuevos Productos'
    }
  },
  {
    path: 'audits',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/audits/audits.module#AuditsModule',
    data: {
      name: 'Control de embalajes'
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
    path: 'warehouse',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/locations/locations.module#LocationsModule',
    data: {
      name: 'Almacenes'
    }
  },
  {
    path: 'manage-agencies',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/agency/agency.module#AgencyModule',
    data: {
      name: 'Agencias'
    }
  },
  {
    path: 'global-variables',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/global-variables/global-variables.module#GlobalVariablesModule',
    data: {
      name: 'Variables globales'
    }
  },
  {
    path: 'workwave-config-menu',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/workwave-config-menu/workwave-config-menu.module#WorkwaveConfigMenuModule',
    data: {
      name: 'Configuración de olas de trabajo'
    }
  },
  {
    path: 'workwaves-scheduled',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/workwaves-schedule/workwaves-schedule.module#WorkwavesScheduleModule',
    data: {
      name: 'Programadas'
    }
  },
  {
    path: 'workwave-template-rebuild',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/workwave-template-rebuild/workwave-template-rebuild.module#WorkwaveTemplateRebuildModule',
    data: {
      name: 'Plantilla'
    }
  },
  {
    path: 'workwave/online-store',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/workwave-template-online-store/workwave-template-online-store.module#WorkwaveTemplateOnlineStoreModule',
    data: {
      name: 'Plantilla'
    }
  },
  {
    path: 'workwaves-history',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/workwaves-history/workwaves-history.module#WorkwavesHistoryModule',
    data: {
      name: 'Historial'
    }
  },
  {
    path: 'reception-hide-alert',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/reception-hide-alert/reception-hide-alert.module#ReceptionHideAlertModule',
    data: {
      name: 'Ocultar Alertas'
    }
  },
  {
    path: 'assign/user/picking',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/user-assignment-picking/user-assignment-picking.module#UserAssignmentPickingModule',
    data: {
      name: ''
    }
  },
  {
    path: 'labels',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/labels/labels.module#LabelsModule',
    data: {
      name: 'Etiquetas'
    }
  },
  {
    path: 'tariff',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/tariffSGA/tariffSGA.module#TariffSGAModule',
    data: {
      name: 'Tarifas'
    }
  },
  {
    path: 'incidences',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/incidences-list/incidences-list.module#IncidencesListModule',
    data: {
      name: 'Notificaciones'
    }
  },
  {
    path: 'incidences-reception',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/incidences-reception-list/incidences-reception-list.module#IncidencesReceptionListModule',
    data: {
      name: 'Incidencias'
    }
  },
  {
    path: 'prices',
    redirectTo: 'products',
    data: {
      name: 'Precios'
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
    path: 'building',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/building/building.module#BuildingModule',
    data: {
      name: 'Edificios'
    }
  },
  {
    path: 'sorter',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/sorter/sorter.module#SorterModule',
    data: {
      name: 'Plantillas'
    }
  },
  {
    path: 'sorter-new',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/sorter-create/sorter-create.module#SorterCreateModule',
    data: {
      name: 'Crear Sorter'
    }
  },
  {
    path: 'regions',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/regions/regions.module#RegionsModule',
    data: {
      name: 'Regiones'
    }
  },
  {
    path: 'receptions-avelon',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/receptions-avelon/receptions-avelon.module#ReceptionsAvelonModule',
    data: {
      name: 'Recepciones'
    }
  },
  {
    path: 'reception-final',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/reception-final/reception-final.module#ReceptionFinalModule',
    data: {
      name: 'ReceptionFinal'
    }
  },
  {
    path: 'predistributions',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/predistributions/predistributions.module#PredistributionsModule',
    data: {
      name: 'Predistribuciones'
    }
  },
  {
    path: 'receptions',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/receptionss-avelon/receptionss-avelon.module#ReceptionssAvelonModule',
    data: {
      name: 'Recepciones'
    }
  },
  {
    path: 'pr-ta-se-av',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/products-avelon/products-avelon.module#ProductsAvelonModule',
    data: {
      name: 'ProductsAvelon'
    }
  },
  {
    path: 'seasons-enabled',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/seasons-enabled/seasons-enabled.module#SeasonsEnabledModule',
    data: {
      name: 'SeasonsEnabled'
    }
  },
  {
    path: 'drop-files',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/drop-files/drop-files.module#DropFilesModule',
    data: {
      name: 'Drop-Files'
    }
  },
  {
    path: 'expedition-manual',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/expedition-manual/expedition-manual.module#ExpeditionManualModule',
    data: {
      name: 'Expedition-Manual'
    }
  },
  {
    path: 'expedition-collected',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/expedition-collected/expedition-collected.module#ExpeditionCollectedModule',
    data: {
      name: 'Expedition-Collected'
    }
  },
  {
    path: 'unlock-expeditions',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/unlock-expeditions/unlock-expeditions.module#UnlockExpeditionsModule',
    data: {
      name: 'Desbloquear'
    }
  },
  {
    path: 'transport-orders',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/transports-orders/transports-orders.module#TransportsOrdersModule',
    data: {
      name: 'Ordenes de Transporte Opl'
    }
  },
  {
    path: 'transports',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/transports-expeditions/transports-expeditions.module#TransportsExpeditionsModule',
    data: {
      name: 'Transportes de expediciones'
    }
  },
  {
    path: 'expedition-inside',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/expeditions-inside/expedition-inside.module#ExpeditionInsideModule',
    data: {
      name: 'Transportes de expediciones'
    }
  },
  {
    path: 'package-history',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/package-history/package-history.module#PackageHistoryModule',
    data: {
      name: 'Lista de historial de paquetes'
    }
  }, {
    path: 'marketplaces',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/marketplaces/marketplaces.module#MarketplacesModule',
    data: {
      name: 'Marketplaces'
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
